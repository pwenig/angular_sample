class ExportNamestringsService

  def self.export_namestrings
     # Create a directory to put the exports in before they go to S3
     Dir.mkdir(ENV["DIRECTORY_NAME"]) unless File.exists?(ENV["DIRECTORY_NAME"])
     export_campaigns
     export_packages
     export_placements
     export_ads
     export_creatives
  end

  def self.export_campaigns
    headers = []
    filevalues = []
    CampaignInput.all.each do |campaign|
      values = []
      @campaign_obj = format_campaign_export(campaign)
      @campaign_obj.each do |k,v|
        values << v
      end
      filevalues << values
    end
    @campaign_obj.each do |k,v|
      headers << k
    end
    filevalues.unshift(headers)
    filename = create_filename('campaign_namestrings_')
    create_csv(filevalues, filename)
  end

  def self.export_packages
    headers = []
    filevalues = []
    PackageInput.all.each do |package|
      values = []
      @package_obj = format_package_export(package)
      @package_obj.each do |k,v|
        values << v
      end
      filevalues << values
    end
    @package_obj.each do |k,v|
      headers << k
    end
    filevalues.unshift(headers)
    filename = create_filename('package_namestrings_')
    create_csv(filevalues, filename)
  end

  def self.export_placements
    headers = []
    filevalues = []
    PlacementInput.all.each do |placement|
      values = []
      @placement_obj = format_placement_export(placement)
      @placement_obj.each do |k,v|
        values << v
      end
      filevalues << values
    end
    @placement_obj.each do |k,v|
      headers << k
    end
    filevalues.unshift(headers)
    filename = create_filename('placement_namestrings_')
    create_csv(filevalues, filename)
  end

  def self.export_ads
    headers = []
    filevalues = []
    AdInput.all.each do |ad|
      values = []
      @ad_obj = format_ad_export(ad)
      @ad_obj.each do |k,v|
        values << v
      end
      filevalues << values
    end
    @ad_obj.each do |k,v|
      headers << k
    end
    filevalues.unshift(headers)
    filename = create_filename('ad_namestrings_')
    create_csv(filevalues, filename)
  end

  def self.export_creatives
    headers = []
    filevalues = []
    CreativeInput.all.each do |creative|
      values = []
      @creative_obj = format_creative_export(creative)
      @creative_obj.each do |k,v|
        values << v
      end
      filevalues << values
    end
    @creative_obj.each do |k,v|
      headers << k
    end
    filevalues.unshift(headers)
    filename = create_filename('creative_namestrings_')
    create_csv(filevalues, filename)
  end



  def self.create_filename(type)
    return type + DateTime.now.to_s
  end

  def self.create_csv(filevalues, filename)
    local_filename = "/tmp/#{filename}.csv"
    File.open(local_filename, "w", :headers => true) {|f| f.write(filevalues.inject([]) { |csv, row|  csv << CSV.generate_line(row) }.join(""))}
    export_file(local_filename, "#{ENV["DIRECTORY_NAME"]}/#{filename}.csv")
    # Delete the file after it's been uploaded
    File.delete(local_filename)
  end

  # Send to S3
  def self.export_file(local_path, bucket_path)
    puts "#{local_path} => #{ENV['AWS_S3_BUCKET']}/#{bucket_path}"
    s3 = Aws::S3::Resource.new(region: ENV["AWS_S3_REGION"], access_key_id: ENV["AWS_ACCESS_KEY_ID"], secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"])
    obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(bucket_path)
    begin
      obj.upload_file(local_path)
      puts "Successfully uploaded #{local_path} to S3"
    rescue Aws::S3::Errors::ServiceError => ex
      puts ex.message
      puts 'There was an error uploading to S3'
    end

  end

  def self.format_campaign_export(campaign)
    {
      campaign_input_tag: campaign.campaign_input_tag,
      program: campaign.program&.abbrev,
      network: campaign.network&.abbrev,
      season: campaign.season&.abbrev,
      campaign_type: campaign.campaign_type&.abbrev,
      custom: campaign.custom,
      start_month: campaign.start_month,
      start_year: campaign.start_year,
      start_day: campaign.start_day,
      end_month: campaign.end_month,
      end_year: campaign.end_year,
      end_day: campaign.end_day,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at
    }
  end

  def self.format_package_export(package)
    {
      package_input_tag: package.package_input_tag,
      campaign_input_tag: package.campaign_input&.campaign_input_tag,
      agency: package.agency&.abbrev,
      publisher: package.publisher&.abbrev,
      buy_method: package.buy_method&.abbrev,
      inventory_type: package.inventory_type&.abbrev,
      custom: package.custom,
      created_at: package.created_at,
      updated_at: package.updated_at
    }
  end

  def self.format_placement_export(placement)
    {
      placement_input_tag: placement.placement_input_tag,
      package_input_tag: placement.package_input.package_input_tag,
      tentpole_details: placement&.tentpole_details,
      tactic: placement.tactic&.abbrev,
      ad_type: placement.ad_type&.abbrev,
      device: placement.device&.abbrev,
      audience_type: placement.audience_type,
      width: placement&.width,
      height: placement&.height,
      targeting_type_1: placement.targeting_type_1&.abbrev,
      targeting_type_2: placement.targeting_type_2&.abbrev,
      targeting_type_3: placement.targeting_type_3&.abbrev,
      targeting_type_4: placement.targeting_type_4&.abbrev,
      episode_start: placement.episode_start&.abbrev,
      episode_end: placement.episode_end&.abbrev,
      created_at: placement.created_at,
      updated_at: placement.updated_at
    }
  end

  def self.format_ad_export(ad)
    {
      ad_input_tag: ad.ad_input_tag,
      placement_input_tag: ad.placement_input.placement_input_tag,
      creative_group: ad.creative_group&.abbrev,
      custom: ad.custom,
      created_at: ad.created_at,
      updated_at: ad.updated_at
    }
  end

  def self.format_creative_export(creative)
    {
      creative_input_tag: creative.creative_input_tag,
      ad_input_tag: creative.ad_input.ad_input_tag,
      creative_message: creative.creative_message&.abbrev,
      abtest_label: creative.abtest_label&.abbrev,
      video_length: creative.video_length&.abbrev,
      start_month: creative.start_month,
      start_day: creative.start_day,
      start_year: creative.start_year,
      end_month: creative.end_month,
      end_day: creative.end_day,
      end_year: creative.end_year,
      custom: creative.custom,
      creative_version_number: creative.creative_version_number,
      created_at: creative.created_at,
      updated_at: creative.updated_at
    }
  end

end