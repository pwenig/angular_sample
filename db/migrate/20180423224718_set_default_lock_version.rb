class SetDefaultLockVersion < ActiveRecord::Migration[5.1]
  def change 
    change_column :campaign_inputs, :lock_version, :integer, default: 0
    change_column :package_inputs, :lock_version, :integer, default: 0
    change_column :placement_inputs, :lock_version, :integer, default: 0
    change_column :ad_inputs, :lock_version, :integer, default: 0
    change_column :creative_inputs, :lock_version, :integer, default: 0  
    [CampaignInput, PackageInput, PlacementInput, AdInput, CreativeInput].each do |cl|
      cl.all.each { |obj| obj.lock_version = 0; obj.save }
    end 
  end
end
