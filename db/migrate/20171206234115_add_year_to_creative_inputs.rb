class AddYearToCreativeInputs < ActiveRecord::Migration[5.1]
  def change
    add_column :creative_inputs, :start_year, :integer, null: false, default: 2017
    add_column :creative_inputs, :end_year, :integer, null: false, default: 2017
  end
end
