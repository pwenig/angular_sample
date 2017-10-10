class AddIndex < ActiveRecord::Migration[5.1]
  def change
    add_index :networks, :name, unique: true
    add_index :networks, :abbrev, unique: true
    add_index :programs, [:network_id, :name], unique: true
    add_index :programs, [:network_id, :abbrev], unique: true
    add_index :agencies, :name, unique: true
    add_index :agencies, :abbrev, unique: true
  end
end
