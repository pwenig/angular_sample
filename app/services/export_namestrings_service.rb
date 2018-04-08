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
    directory = ENV["DIRECTORY_NAME"]
    File.open("#{directory}/#{filename}.csv", "w", :headers => true) {|f| f.write(filevalues.inject([]) { |csv, row|  csv << CSV.generate_line(row) }.join(""))}
    export_file("#{directory}/#{filename}.csv")
  end 

  # Send to S3
  def self.export_file(file_path)
    s3 = Aws::S3::Resource.new(region: ENV["REGION"], access_key_id: ENV["AWS_ACCESS_KEY"], secret_access_key: ENV["AWS_SECRET_KEY"])
    obj = s3.bucket(ENV["BUCKET"]).object(file_path)
    begin
      obj.upload_file(file_path)
      # Delete the file after it's been uploaded
      File.delete(file_path)
      puts "Successfully uploaded #{file_path} to S3"
    rescue Aws::S3::Errors::ServiceError
      puts 'There was an error uploading to S3'
    end

  end 

  def self.format_campaign_export(campaign)
    campaign_object = {}
    campaign_object['campaign_input_tag'] = campaign.campaign_input_tag
    campaign_object['program'] = campaign.program.abbrev
    campaign_object['network'] = campaign.network.abbrev
    campaign_object['season'] = campaign.season.abbrev
    campaign_object['campaign_type'] = campaign.campaign_type.abbrev
    campaign_object['custom'] = campaign.custom
    campaign_object['start_month'] = campaign.start_month
    campaign_object['start_year'] = campaign.start_year
    campaign_object['start_day'] = campaign.start_day 
    campaign_object['end_month'] = campaign.end_month 
    campaign_object['end_year'] = campaign.end_year
    campaign_object['end_day'] = campaign.end_day
    campaign_object['created_at'] = campaign.created_at
    campaign_object['updated_at'] = campaign.updated_at
    campaign_object
  end 

  def self.format_package_export(package)
    package_object = {}
    package_object['package_input_tag'] = package.package_input_tag
    package_object['campaign_input_tag'] = package.campaign_input.campaign_input_tag
    package_object['agency'] = package.agency.abbrev
    package_object['publisher'] = package.publisher.abbrev
    package_object['buy_method'] = package.buy_method.abbrev 
    package_object['inventory_type'] = package.inventory_type.abbrev 
    package_object['custom'] = package.custom
    package_object['created_at'] = package.created_at
    package_object['updated_at'] = package.updated_at
    package_object
  end 

  def self.format_placement_export(placement)
    placement_object = {}
    placement_object['placement_input_tag'] = placement.placement_input_tag
    placement_object['package_input_tag'] = placement.package_input.package_input_tag
    placement_object['tentpole_details'] = placement.try(:tentpole_details)
    placement_object['tactic'] = placement.tactic.abbrev 
    placement_object['ad_type'] = placement.ad_type.abbrev
    placement_object['device'] = placement.device.abbrev  
    placement_object['audience_type'] = placement.audience_type
    placement_object['width'] = placement.try(:width)
    placement_object['height'] = placement.try(:height)
    placement_object['targeting_type_1'] = placement.targeting_type_1.abbrev
    placement_object['targeting_type_2'] = placement.targeting_type_2.abbrev
    placement_object['targeting_type_3'] = placement.targeting_type_3.abbrev
    placement_object['targeting_type_4'] = placement.targeting_type_4.abbrev
    placement_object['episode_start'] = placement.episode_start.abbrev 
    placement_object['episode_end'] = placement.episode_end.abbrev
    placement_object['created_at'] = placement.created_at
    placement_object['updated_at'] = placement.updated_at
    
    placement_object
  end 

  def self.format_ad_export(ad)
    ad_object = {}
    ad_object['ad_input_tag'] = ad.ad_input_tag
    ad_object['placement_input_tag'] = ad.placement_input.placement_input_tag
    ad_object['creative_group'] = ad.creative_group.abbrev 
    ad_object['custom'] = ad.custom 
    ad_object['created_at'] = ad.created_at
    ad_object['updated_at'] = ad.updated_at
    ad_object
  end 

  def self.format_creative_export(creative)
    creative_object = {}
    creative_object['creative_input_tag'] = creative.creative_input_tag
    creative_object['ad_input_tag'] = creative.ad_input.ad_input_tag
    creative_object['creative_message'] = creative.creative_message.abbrev
    creative_object['abtest_label'] = creative.abtest_label.abbrev
    creative_object['video_length'] = creative.video_length.try(:abbrev)
    creative_object['start_month'] = creative.start_month
    creative_object['start_day'] = creative.start_day
    creative_object['start_year'] = creative.start_year
    creative_object['end_month'] = creative.end_month
    creative_object['end_day'] = creative.end_day
    creative_object['end_year'] = creative.end_year
    creative_object['custom'] = creative.custom
    creative_object['creative_version_number'] = creative.creative_version_number
    creative_object['created_at'] = creative.created_at
    creative_object['updated_at'] = creative.updated_at
    creative_object
  end 


end 