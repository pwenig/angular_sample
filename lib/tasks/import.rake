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
          Network.create!(name: row['Name'], abbrev: row['Abbrev'])
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
      csv.each do |row|
        next if Program.exists?(name: row['Program'])
        network = Network.find_by(name: row['Network'])
        Program.create!(name: row['Program'], abbrev: row['Program_abbrev'], network: network)
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
          Season.create!(name: row['SEASON'], abbrev: row['SN ABBR'])
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
          CampaignType.create!(name: row['CAMPAIGN TYPE'], abbrev: row['CPN TYPE ABBR'])
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
          BuyMethod.create!(name: row['BUY METHOD'], abbrev: row['BUY ABBR'])
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
          Publisher.create!(name: row['PUBLISHER'], abbrev: row['PUB ABBR'])
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
          Agency.create!(name: row['AGENCY'], abbrev: row['AGY ABBR'])
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
          InventoryType.create!(name: row['INVENTORY TYPE'], abbrev: row['INV ABBR'])
        end
      end
    end
    puts 'Upload finished!'
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
