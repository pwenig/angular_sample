require 'csv'

namespace :import do
  task networks: :environment do
    puts 'Starting Networks upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'networks.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        # Only create the network if it does not exist yet
        unless Network.exists?(name: row['Name'])
          Network.create!(name: row['Name'].strip, abbrev: row['Abbrev'].strip)
        end
      end
    end
    export_to_csv(Network.all)
    puts 'Upload finished!'
  end

  task programs: :environment do
    puts 'Starting Programs upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'programs.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each_with_index do |row, line|
        begin
          next if Program.exists?(name: row['Program'])
          network = Network.find_by(name: row['Network'].strip)
          if !network
            puts "No such network: #{row['Network']} for program: #{row['Program']} on line: #{line - 1}."
          else
            Program.create!(name: row['Program'].strip, abbrev: row['Program_abbrev'].strip, network: network)
          end
        rescue StandardError => ex
          puts "Failed to create program: #{row['Program']}, line: #{line - 1}"
          puts ex
        end
      end
    end
    puts 'Upload finished!'
  end

  task seasons: :environment do
    puts 'Starting Seasons upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'seasons.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Season.exists?(name: row['SEASON'])
          Season.create!(name: row['SEASON'].strip, abbrev: row['SN ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task campaign_types: :environment do
    puts 'Starting Campaign Types upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'campaign_types.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless CampaignType.exists?(name: row['CAMPAIGN TYPE'])
          CampaignType.create!(name: row['CAMPAIGN TYPE'].strip, abbrev: row['CPN TYPE ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task buy_methods: :environment do
    puts 'Starting Buy Methods upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'buy_methods.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless BuyMethod.exists?(name: row['BUY METHOD'])
          BuyMethod.create!(name: row['BUY METHOD'].strip, abbrev: row['BUY ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task publishers: :environment do
    puts 'Starting Publishers upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'publishers.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Publisher.exists?(name: row['PUBLISHER'])
          Publisher.create!(name: row['PUBLISHER'].strip, abbrev: row['PUB ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task agencies: :environment do
    puts 'Starting Agencies upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'agencies.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Agency.exists?(name: row['AGENCY'])
          Agency.create!(name: row['AGENCY'].strip, abbrev: row['AGY ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task inventory_types: :environment do
    puts 'Starting Inventory Types upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'inventory_types.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless InventoryType.exists?(name: row['INVENTORY TYPE'])
          InventoryType.create!(name: row['INVENTORY TYPE'].strip, abbrev: row['INV ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task tactics: :environment do
    puts 'Starting Tactics upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'tactics.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Tactic.exists?(name: row['TACTIC'])
          Tactic.create!(name: row['TACTIC'].strip, abbrev: row['TAC ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task devices: :environment do
    puts 'Starting Devices upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'devices.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Device.exists?(name: row['DEVICE'])
          Device.create!(name: row['DEVICE'].strip, abbrev: row['DVC ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task ad_types: :environment do
    puts 'Starting Ad Types upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'ad_types.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless AdType.exists?(name: row['AD TYPE'])
          AdType.create!(name: row['AD TYPE'].strip, abbrev: row['AD ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task episodes: :environment do
    puts 'Starting Episodes upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'episodes.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless Episode.exists?(name: row['EPISODE'])
          Episode.create!(name: row['EPISODE'].strip, abbrev: row['EP ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task targeting_types: :environment do
    puts 'Starting Targeting Types upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'targeting_types.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless TargetingType.exists?(name: row['TARGETING TYPE'])
          TargetingType.create!(name: row['TARGETING TYPE'].strip, abbrev: row['TGT ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task creative_groups: :environment do
    puts 'Starting Creative Groups upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'creative_groups.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless CreativeGroup.exists?(name: row['CREATIVE GROUP'])
          CreativeGroup.create!(name: row['CREATIVE GROUP'].strip, abbrev: row['CTVE GRP ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task creative_messages: :environment do
    puts 'Starting Creative Message upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'creative_messages.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless CreativeMessage.exists?(name: row['CREATIVE MESSAGE'])
          CreativeMessage.create!(name: row['CREATIVE MESSAGE'].strip, abbrev: row['CTVE MSG ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task abtest_labels: :environment do
    puts 'Starting AB Test Labels upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'abtest_labels.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless AbtestLabel.exists?(name: row['A/B TEST LABEL'])
          AbtestLabel.create!(name: row['A/B TEST LABEL'].strip, abbrev: row['A/B ABBR'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task video_lengths: :environment do
    puts 'Starting Video Lengths upload...'
    puts ''
    ActiveRecord::Base.transaction do
      csv_text = File.read(Rails.root.join('lib', 'csv_data', 'video_lengths.csv')).scrub
      csv = CSV.parse(csv_text, headers: true)
      csv.each do |row|
        unless VideoLength.exists?(name: row['VIDEO LENGTH'] || row['VIDEO LENGTH']).blank?
          VideoLength.create!(name: row['VIDEO LENGTH'].strip)
        end
      end
    end
    puts 'Upload finished!'
  end

  task validate_namestrings: :environment do
    puts 'Starting Namestring Validation'
    puts ''
    ImportNamestringService.validate_namestring_file(Rails.root.join('lib', 'csv_data', 'namestrings', 'namestrings.csv'))
    puts 'Validation finished'
  end

  # by default, this imports from lib/csv_data/namestrings.csv
  # otherwise, if a filename argument is provided,
  # this will read from lib/csv_data/<basename>.csv
  task :namestrings, [:basename] => :environment do |t, args|
    puts 'Starting Namestring Import'
    puts ''
    filename = args.basename.present? ? "#{args.basename}.csv" : 'namestrings.csv'
    ImportNamestringService.import_namestring_file(Rails.root.join('lib', 'csv_data', 'namestrings', filename))
    puts 'Import finished'
  end

  task all: :environment do
    Rake::Task['import:networks'].invoke
    Rake::Task['import:programs'].invoke
    Rake::Task['import:seasons'].invoke
    Rake::Task['import:campaign_types'].invoke
    Rake::Task['import:buy_methods'].invoke
    Rake::Task['import:publishers'].invoke
    Rake::Task['import:agencies'].invoke
    Rake::Task['import:inventory_types'].invoke
    Rake::Task['import:tactics'].invoke
    Rake::Task['import:devices'].invoke
    Rake::Task['import:ad_types'].invoke
    Rake::Task['import:episodes'].invoke
    Rake::Task['import:targeting_types'].invoke
    Rake::Task['import:creative_groups'].invoke
    Rake::Task['import:creative_messages'].invoke
    Rake::Task['import:abtest_labels'].invoke
    Rake::Task['import:video_lengths'].invoke
  end

  # Delete and imports data
  task reset: :environment do
    puts 'Deleting...'
    puts 'Campaign Inputs'
    CampaignInput.destroy_all
    puts 'Package Inputs'
    PackageInput.destroy_all
    puts 'Placement Inputs'
    PlacementInput.destroy_all
    puts 'Ad Inputs'
    AdInput.destroy_all
    puts 'Creative Inputs'
    CreativeInput.destroy_all
    puts 'AB Test Labels'
    AbtestLabel.destroy_all
    puts 'Ad Types'
    AdType.destroy_all
    puts 'Buy Methods'
    BuyMethod.destroy_all
    puts 'Campaign Types'
    CampaignType.destroy_all
    puts 'Creative Groups'
    CreativeGroup.destroy_all
    puts 'Creative Messages'
    CreativeMessage.destroy_all
    puts 'Devices'
    Device.destroy_all
    puts 'Episodes'
    Episode.destroy_all
    puts 'Inventory Types'
    InventoryType.destroy_all
    puts 'Programs'
    Program.destroy_all
    puts 'Networks'
    Network.destroy_all
    puts 'Publishers'
    Publisher.destroy_all
    puts 'Seasons'
    Season.destroy_all
    puts 'Tactics'
    Tactic.destroy_all
    puts 'Targeting Types'
    TargetingType.destroy_all
    puts 'Video Lengths'
    VideoLength.destroy_all
    puts 'Finished deleting...'
    puts ''
    puts 'Importing new data...'
    puts ''
    Rake::Task['import:networks'].invoke
    Rake::Task['import:programs'].invoke
    Rake::Task['import:seasons'].invoke
    Rake::Task['import:campaign_types'].invoke
    Rake::Task['import:buy_methods'].invoke
    Rake::Task['import:publishers'].invoke
    Rake::Task['import:inventory_types'].invoke
    Rake::Task['import:tactics'].invoke
    Rake::Task['import:devices'].invoke
    Rake::Task['import:ad_types'].invoke
    Rake::Task['import:episodes'].invoke
    Rake::Task['import:targeting_types'].invoke
    Rake::Task['import:creative_groups'].invoke
    Rake::Task['import:creative_messages'].invoke
    Rake::Task['import:abtest_labels'].invoke
    Rake::Task['import:video_lengths'].invoke
    puts ''
    puts 'Reset completed'
  end 

  def export_to_csv(networks)
    CSV.open('./lib/csv_data/networks_normalized.csv', 'wb') do |csv|
      csv << Network.attribute_names
      networks.each do |network|
        csv << network.attributes.values
      end
    end
  end
end
