class CreateTargetingTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :targeting_types do |t|
      t.string :name, null: false
      t.index :name, unique: true 
      t.string :abbrev, null: false
      t.index :abbrev, unique: true

      t.timestamps
    end
  end
end
