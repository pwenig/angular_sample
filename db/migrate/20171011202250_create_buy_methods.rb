class CreateBuyMethods < ActiveRecord::Migration[5.1]
  def change
    create_table :buy_methods do |t|
      t.string :name, null: false
      t.string :abbrev, null: false 
      t.index :name, unique: true
      t.index :abbrev, unique: true

      t.timestamps
    end
  end
end
