class CreateRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :requests do |t|
      t.string :requestor, null: false
      t.string :administrator
      t.string :brand, null: false
      t.string :dimension, null: false
      t.string :dimension_value, null: false
      t.text :additional_info
      t.string :status, null: false
      t.timestamps
    end
  end
end
