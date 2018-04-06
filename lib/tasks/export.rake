require 'csv'
require 'aws-sdk-s3'
require 'fileutils'

namespace :export do 
  task namestrings: :environment do 
    puts 'Starting export...'
    puts ''
    # Create a directory to put the exports in before they go to S3
    directory_name = "exports"
    Dir.mkdir(directory_name) unless File.exists?(directory_name)
    counter = 0
    # Export campaign inputs
    CampaignInput.all.each do |campaign|
      counter +=1
      filename = create_filename('campaign_namestring_', counter)
      campaign_obj = format_campaign_export(campaign)
      export_data = prepare_export_object(campaign_obj)
      headers = export_data[0]
      values = export_data[1]
      create_csv(headers, values, filename)

      if campaign.package_inputs.length > 0
        # Export package inputs
        campaign.package_inputs.each do |package|
          counter +=1
          filename = create_filename('package_namestring_', counter)
          package_obj = format_package_export(package)
          export_data = prepare_export_object(package_obj)
          headers = export_data[0]
          values = export_data[1]
          create_csv(headers, values, filename)

          if package.placement_inputs.length > 0
          # Export placement inputs
            package.placement_inputs.each do |placement|
              counter +=1
              filename = create_filename('placement_namestring_', counter) 
              placement_obj = format_placement_export(placement)
              export_data = prepare_export_object(placement_obj)
              headers = export_data[0]
              values = export_data[1]
              create_csv(headers, values, filename)

              if placement.ad_inputs.length > 0
                # Export ad inputs
                placement.ad_inputs.each do |ad|
                  counter +=1
                  filename = create_filename('ad_namestring_', counter)
                  ad_obj = format_ad_export(ad)
                  export_data = prepare_export_object(ad_obj)
                  headers = export_data[0]
                  values = export_data[1]
                  create_csv(headers, values, filename)

                  if ad.creative_inputs.length > 0
                    # Export creative inputs
                    ad.creative_inputs.each do |creative|
                      counter +=1 
                      filename = create_filename('creative_namestring_', counter)
                      creative_obj = format_creative_export(creative)
                      export_data = prepare_export_object(creative_obj)
                      headers = export_data[0]
                      values = export_data[1]
                      create_csv(headers, values, filename)
                    end 
                  end 
                end 
              end 
            end 
          end 
        end 
      end 
    end 
  end 

  def prepare_export_object(namestring_object)
    headers = []
    values = []
    namestring_object.each do |k,v|
      headers << k 
      values << v
    end 
    return [headers, values]


  end 

  def create_filename(type, counter)
    return type + counter.to_s + '_' + DateTime.now.to_s
  end 

  def create_csv(headers, values, filename)
    CSV.open("exports/#{filename}.csv", "w") do |csv|
      csv << headers
      csv << values
    end
    export_file("exports/#{filename}.csv")
  end 

  # Send to S3
  def export_file(file_path)
    s3 = Aws::S3::Resource.new(region:'us-west-2', access_key_id: ENV["ACCESS_KEY"], secret_access_key: ENV["SECRET_KEY"])
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

  def format_campaign_export(campaign)
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
    campaign_object
  end 

  def format_package_export(package)
    package_object = {}
    package_object['package_input_tag'] = package.package_input_tag
    package_object['agency'] = package.agency.abbrev
    package_object['publisher'] = package.publisher.abbrev
    package_object['buy_method'] = package.buy_method.abbrev 
    package_object['inventory_type'] = package.inventory_type.abbrev 
    package_object['custom'] = package.custom
    package_object
  end 

  def format_placement_export(placement)
    placement_object = {}
    placement_object['placement_input_tag'] = placement.placement_input_tag
    placement_object['tentpole_details'] = placement.try(:tentpole_details)
    placement_object['tactic'] = placement.tactic.abbrev 
    placement_object['ad_type'] = placement.ad_type.abbrev 
    placement_object['audience_type'] = placement.audience_type
    placement_object['width'] = placement.try(:width)
    placement_object['height'] = placement.try(:height)
    placement_object['targeting_type_1'] = placement.targeting_type_1.abbrev
    placement_object['targeting_type_2'] = placement.targeting_type_2.abbrev
    placement_object['targeting_type_3'] = placement.targeting_type_3.abbrev
    placement_object['targeting_type_4'] = placement.targeting_type_4.abbrev
    placement_object['episode_start'] = placement.episode_start.abbrev 
    placement_object['episode_end'] = placement.episode_end.abbrev
    placement_object
  end 

  def format_ad_export(ad)
    ad_object = {}
    ad_object['ad_input_tag'] = ad.ad_input_tag
    ad_object['creative_group'] = ad.creative_group.abbrev 
    ad_object['custom'] = ad.custom 
    ad_object
  end 

  def format_creative_export(creative)
    creative_object = {}
    creative_object['creative_input_tag'] = creative.creative_input_tag
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
    creative_object
  end 

end 