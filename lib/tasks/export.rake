namespace :export do 
  task namestrings: :environment do 
    puts 'Starting export...'
    puts ''
    ExportNamestringsService.export_namestrings
    puts ''
    puts 'Export completed'
  end 
end 