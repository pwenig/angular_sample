class ChangeColumns < ActiveRecord::Migration[5.1]
  def change
    change_column_null(:agencies, :name, false)
    change_column_null(:agencies, :abbrev, false)
    change_column_null(:networks, :name, false)
    change_column_null(:networks, :abbrev, false)
    change_column_null(:programs, :name, false)
    change_column_null(:programs, :abbrev, false)
    change_column_null(:programs, :network_id, false)
  end
end
