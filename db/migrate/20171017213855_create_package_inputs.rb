class CreatePackageInputs < ActiveRecord::Migration[5.1]
  def change
    create_table :package_inputs do |t|
      t.references :campaign_input, foreign_key: true, null: false
      t.references :agency, foreign_key: true, null: false
      t.references :publisher, foreign_key: true, null: false
      t.references :buy_method, foreign_key: true, null: false
      t.references :inventory_type, foreign_key: true, null: false
      t.string :custom, null: false
      t.string :package_input_tag, :null => false

      t.timestamps
    end
  end
end
