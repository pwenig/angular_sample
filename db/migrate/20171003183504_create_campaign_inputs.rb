class CreateCampaignInputs < ActiveRecord::Migration[5.1]
  def change
    create_table :campaign_inputs do |t|
      t.references :program, foreign_key: true, :null => false 
      t.references :season, foreign_key: true, :null => false
      t.references :campaign_type, foreign_key: true, :null => false
      t.string :custom, :null => false
      t.integer :start_month, :null => false
      t.integer :start_day, :null => false
      t.integer :start_year, :null => false
      t.integer :end_month, :null => false
      t.integer :end_day, :null => false
      t.integer :end_year, :null => false

      t.timestamps
    end
  end
end
