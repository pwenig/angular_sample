class AddIndex < ActiveRecord::Migration[5.1]
  def change
    add_index :networks, :name, unique: true
    add_index :networks, :abbrev, unique: true
    add_index :programs, :name, unique: true
    add_index :programs, :abbrev, unique: true
    add_index :agencies, :name, unique: true
    add_index :agencies, :abbrev, unique: true
  end
end
