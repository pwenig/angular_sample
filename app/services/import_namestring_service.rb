class ImportNamestringService

  # reads the file, and validates that all reference data is correct and
  # all values are in the right format.
  def self.validate_namestring_file(filename)
    data =  CsvParser.parse(
      File.read(Rails.root.join(filename)).scrub,
      csv_template
    )

    missing_networks = {}
    missing_programs = {}
    missing_seasons = {}
    missing_publishers = {}
    missing_buy_methods = {}
    missing_inventory_types = {}
    missing_creative_groups = {}
    missing_creative_messages = {}
    missing_abtest_labels = {}
    error_count = 0
    data.each_with_index do |row, index|
      if !row[:network] || !Network.find_by_name(row[:network])
        missing_networks[row[:network]] = true
        error_count += 1
      end
      if !row[:program] || !Program.find_by_name(row[:program])
        missing_programs[row[:program]] = true
        error_count += 1
      end
      if !row[:season] || !Season.find_by_name(row[:season])
        missing_seasons[row[:season]] = true
        error_count += 1
      end
      if !row[:publisher] || !Publisher.find_by_name(row[:publisher])
        missing_publishers[row[:publisher]] = true
        error_count += 1
      end
      if !row[:buy_method] || !BuyMethod.find_by_name(row[:buy_method])
        missing_buy_methods[row[:buy_method]] = true
        error_count += 1
      end
      if !row[:inventory_type] || !InventoryType.find_by_name(row[:inventory_type])
        missing_inventory_types[row[:inventory_type]] = true
        error_count += 1
      end
      if !row[:creative_group] || !CreativeGroup.find_by_name(row[:creative_group])
        missing_creative_groups[row[:creative_group]] = true
        error_count += 1
      end
      if !row[:creative_message] || !CreativeMessage.find_by_name(row[:creative_message])
        missing_creative_messages[row[:creative_message]] = true
        error_count += 1
      end
      if !row[:abtest_label] || !AbtestLabel.find_by_name(row[:abtest_label])
        missing_abtest_labels[row[:abtest_label]] = true
        error_count += 1
      end
    end
    if error_count == 0
      puts "All namestrings are valid. No missing references."
    else
      display_missing("Networks", missing_networks)
      display_missing("Programs", missing_programs)
      display_missing("Seasons", missing_seasons)
      display_missing("Publishers", missing_publishers)
      display_missing("Buy Methods", missing_buy_methods)
      display_missing("Inventory Types", missing_inventory_types)
      display_missing("Creative Groups", missing_creative_groups)
      display_missing("Creative Messages", missing_creative_messages)
      display_missing("A/B Test Labels", missing_abtest_labels)
    end
  end

  def self.display_missing(name, object)
    if object.keys.length > 0
      puts "Missing #{name}"
      puts "==================="
      object.keys.each do |key|
        puts "'#{key}'"
      end
      puts
      puts
    end
  end


  def self.import_namestring_file(filename)
    data = CsvParser.parse(
      File.read(Rails.root.join(filename)).scrub,
      csv_template
    )
    data.each_with_index do |row, index|
      begin
        campaign_input = find_or_create_campaign_input(row)
        package_input = find_or_create_package_input(campaign_input, row)
        placement_input = find_or_create_placement_input(package_input, row)
        ad_input = find_or_create_ad_input(placement_input, row)
        creative_input = find_or_create_creative_input(ad_input, row)
      rescue StandardError => ex
        puts "Failed to import line: #{index}, #{ex}"
      end
    end
  end

  def self.find_or_create_campaign_input(row)
    network = Network.find_by_name(row[:network])
    program = Program.find_by_name(row[:program])
    season = Season.find_by_name(row[:season])
    campaign_type = CampaignType.find_by_name(row[:campaign_type])
    params = {
      network: network,
      program: program,
      season: season,
      campaign_type: campaign_type,
      custom: row[:campaign_custom],
      start_month: row[:start_month],
      start_year: row[:start_year],
      start_day: row[:start_day],
      end_year: row[:end_year],
      end_month: row[:end_month],
      end_day: row[:end_day]
    }
    campaign_input = CampaignInput.where(params).take
    if !campaign_input
      campaign_input = CampaignInput.create!(
        params
      )
      puts "Created new campaign input: #{campaign_input.campaign_input_tag}"
    end
    campaign_input
  end

  def self.find_or_create_package_input(campaign_input, row)
    agency = Agency.find_by_abbrev(row[:agency])
    publisher = Publisher.find_by_name(row[:publisher])
    buy_method = BuyMethod.find_by_name(row[:buy_method])
    inventory_type = InventoryType.find_by_name(row[:inventory_type])
    params = {
      campaign_input: campaign_input,
      agency: agency,
      publisher: publisher,
      buy_method: buy_method,
      inventory_type: inventory_type
    }
    package_input = PackageInput.where(params).take
    if !package_input
      package_input = PackageInput.create!(params)
      puts "Created new Package Input: #{package_input.package_input_tag}"
    end
    package_input
  end

  def self.find_or_create_placement_input(package_input, row)
    episode_start = row[:episode_start] ? Episode.find_by_name(row[:episode_start]) : nil
    episode_end = row[:episode_end] ? Episode.find_by_name(row[:episode_end]) : nil
    params = {
      package_input: package_input,
      tactic: Tactic.find_by_name(row[:tactic]),
      device: Device.find_by_name(row[:device]),
      ad_type: AdType.find_by_name(row[:ad_type]),
      targeting_type_1: TargetingType.find_by_name(row[:targeting_type_1]),
      targeting_type_2: TargetingType.find_by_name(row[:targeting_type_2]),
      targeting_type_3: TargetingType.find_by_name(row[:targeting_type_3]),
      targeting_type_4: TargetingType.find_by_name(row[:targeting_type_4]),
      episode_start: episode_start,
      episode_end: episode_end,
      tentpole_details: row[:tentpole_details],
      audience_type: row[:audience_type]
    }
    placement_input = PlacementInput.where(params).take
    if !placement_input
      placement_input = PlacementInput.create!(params)
      puts "Creating new Placement Input: #{placement_input.placement_input_tag}"
    end
    placement_input
  end

  def self.find_or_create_ad_input(placement_input, row)
    params = {
      placement_input: placement_input,
      creative_group: CreativeGroup.find_by_name(row[:creative_group]),
      custom: row[:ad_custom]
    }
    ad_input = AdInput.where(params).take
    if !ad_input
      ad_input = AdInput.create!(params)
      puts "Creating new Ad Input: #{ad_input.ad_input_tag}"
    end
    ad_input
  end

  def self.find_or_create_creative_input(ad_input, row)
    if !row[:abtest_label]
      abtest_label = AbtestLabel.find_by_name('Not Applicable')
    else
      abtest_label = AbtestLabel.find_by_name(row[:abtest_label])
    end
    video_length = row[:video_length] ? VideoLength.find_by_name(row[:video_length]) : nil
    params = {
      ad_input: ad_input,
      creative_message: CreativeMessage.find_by_name(row[:creative_message]),
      custom: row[:creative_version_custom],
      creative_version_number: row[:creative_version_number],
      abtest_label: abtest_label,
      video_length: video_length,
      start_month: row[:creative_start_month],
      start_day: row[:creative_start_day],
      end_month: row[:creative_end_month],
      end_day: row[:creative_end_day]
    }
    creative_input = CreativeInput.where(params).take
    if !creative_input
      creative_input = CreativeInput.create!(params)
      puts "Created new creative input: #{creative_input.creative_input_tag}"
    end
    creative_input
  end

  def self.import_csv_data(csv_text)
    CsvParser.parse(csv_lines, csv_template)
  end

  # returns a template that defines the incoming columns when importing namestrings.
  def self.csv_template
    [
      {
        name: 'Network',
        parsed_name: :network,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Program',
        parsed_name: :program,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Season',
        parsed_name: :season,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Campaign Type',
        parsed_name: :campaign_type,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Campaign Custom',
        parsed_name: :campaign_custom,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Start Year',
        parsed_name: :start_year,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Start Month',
        parsed_name: :start_month,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Start Day',
        parsed_name: :start_day,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'End Year',
        parsed_name: :end_year,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'End Month',
        parsed_name: :end_month,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'End Day',
        parsed_name: :end_day,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Campaign ID',
        parsed_name: :campaign_id,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Agency',
        parsed_name: :agency,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Publisher',
        parsed_name: :publisher,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Buy Method',
        parsed_name: :buy_method,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Inventory Type',
        parsed_name: :inventory_type,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Package Custom',
        parsed_name: :package_custom,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Package ID',
        parsed_name: :package_id_output,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Episode Start',
        parsed_name: :episode_start,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Episode End',
        parsed_name: :episode_end,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Tentpole Details',
        parsed_name: :tentpole_details,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Tactic',
        parsed_name: :tactic,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Device',
        parsed_name: :device,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Ad Type',
        parsed_name: :ad_type,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Targeting Type 1',
        parsed_name: :targeting_type_1,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Targeting Type 2',
        parsed_name: :targeting_type_2,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Targeting Type 3',
        parsed_name: :targeting_type_3,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Targeting Type 4',
        parsed_name: :targeting_type_4,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Audience Type',
        parsed_name: :audience_type,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Width',
        parsed_name: :width,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Height',
        parsed_name: :height,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Placement ID',
        parsed_name: :placement_id,
        parser:  CsvParser.parse_string_proc
      },
      {
        name: 'Creative Group',
        parsed_name: :creative_group,
        parser:  CsvParser.parse_string_proc
      },
      {
        name: 'Ad Custom',
        parsed_name: :ad_custom,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Ad ID',
        parsed_name: :ad_id,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Network',
        parsed_name: :creative_network,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Program',
        parsed_name: :creative_program,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Season',
        parsed_name: :creative_season,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Message',
        parsed_name: :creative_message,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Theme Custom',
        parsed_name: :creative_theme_custom,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Version Number',
        parsed_name: :creative_version_number,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'A/B Test Label',
        parsed_name: :a_b_test_label,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Video Length',
        parsed_name: :video_length,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Creative Start Month',
        parsed_name: :creative_start_month,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Creative Start Day',
        parsed_name: :creative_start_day,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Creative End Month',
        parsed_name: :creative_end_month,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Creative End Day',
        parsed_name: :creative_end_day,
        parser: CsvParser.parse_integer_proc
      },
      {
        name: 'Creative Id',
        parsed_name: :creative_id,
        parser: CsvParser.parse_string_proc
      },
      {
        name: 'Omniture Code',
        parsed_name: :omniture_code,
        parser: CsvParser.parse_string_proc
      }
    ]
  end


end
