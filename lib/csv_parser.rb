require 'csv'

#
# The column_metadata is an array of maps. Each map has a name: and a parse: attribute.
# The parse attribute is a method that will parse that column and return the correct type.
# This loads the entire dataset into memory so may not be appropriate for large files.
#
class CsvParser
  def self.parse(csv_lines, column_metadata)
    parsed_lines = []
    rows = CSV.parse(csv_lines, headers: true, return_headers: true)
    line_number = 1
    header = rows[0]
    self.validate_header(header, column_metadata)
    (1..(rows.length - 1)).each do |index|
      parsed_lines.append self.parse_row(line_number, rows[index], column_metadata)
      line_number += 1
    end
    parsed_lines
  end

  def self.parse_string_proc
    Proc.new { |val| val.to_s }
  end

  def self.parse_decimal_proc(precision = 2)
    Proc.new { |val| BigDecimal.new(val).round(precision) }
  end

  def self.parse_integer_proc
    Proc.new { |val| val.to_i }
  end


  def self.parse_row(line_number, row, column_metadata)
    parsed_row = {}
    column_metadata.each do |exp|
      if row[exp[:name]]
        begin
          key = exp[:parsed_name] ? exp[:parsed_name] : exp[:name]
          parsed_row[key] = exp[:parser].call(row[exp[:name]])
        rescue Exception => ex
          raise Exception.new("Error on line: #{line_number}. Invalid format for column: #{exp[:name]}, value: #{row[exp[:name]]}")
        end
      else
        if exp[:required]
          raise Exception.new("Error on line: #{line_number}. Missing value for required column: #{exp[:name]}")
        else
          parsed_row[key] = ''
        end
      end
    end
    parsed_row
  end

  private

  def self.validate_header(header, column_metadata)
    unexpected_columns = []
    missing_columns = []
    column_names = column_metadata.map { |c| c[:name] }
    header.headers.each do |name|
      if !column_names.include? name
        unexpected_columns.push name
      end
    end
    column_names.each do |name|
      if header[name].blank?
        missing_columns.push name
      end
    end
    if unexpected_columns.length > 0
      raise Exception.new("Error on header. Unexpected column(s): #{unexpected_columns.join(',')}.")
    end
    if missing_columns.length > 0
      raise Exception.new("Error on header. Missing column(s): #{missing_columns.join(',')}.")
    end
    true
  end

end
