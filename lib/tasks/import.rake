require 'csv'

namespace :import do
  task networks: :environment do
    puts 'Starting upload...'
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
    puts 'Starting upload...'
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

  def export_to_csv(networks)
    CSV.open('./lib/csv_data/networks_normalized.csv', 'wb') do |csv|
      csv << Network.attribute_names
      networks.each do |network|
        csv << network.attributes.values
      end
    end
  end
end
