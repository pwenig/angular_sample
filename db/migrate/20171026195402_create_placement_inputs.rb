class CreatePlacementInputs < ActiveRecord::Migration[5.1]
  def change
    create_table :placement_inputs do |t|
      t.string :placement_input_tag, null: false
      t.string :tentpole_details, null: true
      t.references :tactic, foreign_key: true, null: false
      t.references :device, foreign_key: true, null: false
      t.references :ad_type, foreign_key: true, null: false
      t.string :audience_type, null: false
      t.integer :width, null: false
      t.integer :height, null: false
      t.references :package_input, foreign_key: true, null: false
      t.references :targeting_type_1, foreign_key: { to_table: :targeting_types }, index: true
      t.references :targeting_type_2, foreign_key: { to_table: :targeting_types }, index: true
      t.references :targeting_type_3, foreign_key: { to_table: :targeting_types }, index: true
      t.references :targeting_type_4, foreign_key: { to_table: :targeting_types }, index: true
      t.references :episode_start, foreign_key: { to_table: :episodes }, index: true
      t.references :episode_end, foreign_key: { to_table: :episodes }, index: true
      
      t.timestamps
    end
  end
end
