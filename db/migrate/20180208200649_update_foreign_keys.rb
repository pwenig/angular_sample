class UpdateForeignKeys < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :creative_inputs, :ad_inputs
    add_foreign_key :creative_inputs, :ad_inputs, on_delete: :cascade
    remove_foreign_key :ad_inputs, :placement_inputs
    add_foreign_key :ad_inputs, :placement_inputs, on_delete: :cascade
    remove_foreign_key :placement_inputs, :package_inputs
    add_foreign_key :placement_inputs, :package_inputs, on_delete: :cascade
    remove_foreign_key :package_inputs, :campaign_inputs
    add_foreign_key :package_inputs, :campaign_inputs, on_delete: :cascade
  end
end
