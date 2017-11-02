class CreateAdInputs < ActiveRecord::Migration[5.1]
  def change
    create_table :ad_inputs do |t|
      t.references :placement_input, foreign_key: true
      t.references :creative_group, foreign_key: true
      t.string :custom, null: false
      t.string :ad_input_tag, null: false

      t.timestamps
    end
  end
end
