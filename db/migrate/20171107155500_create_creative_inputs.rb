class CreateCreativeInputs < ActiveRecord::Migration[5.1]
  def change
    create_table :creative_inputs do |t|
      t.references :ad_input, foreign_key: true
      t.references :creative_message, foreign_key: true
      t.references :abtest_label, foreign_key: true
      t.references :video_length, foreign_key: true
      t.string :start_month, null: false
      t.string :start_day, null: false
      t.string :end_month, null: false
      t.string :end_day, null: false
      t.string :creative_input_tag, null: false
      t.string :custom
      t.string :creative_version_number, null: false

      t.timestamps
    end
  end
end
