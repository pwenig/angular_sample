class AddLockVersion < ActiveRecord::Migration[5.1]
  def self.up
    add_column :campaign_inputs, :lock_version, :integer, default: 0, null: false
    add_column :package_inputs, :lock_version, :integer, default: 0, null: false
    add_column :placement_inputs, :lock_version, :integer, default: 0, null: false
    add_column :ad_inputs, :lock_version, :integer, default: 0, null: false
    add_column :creative_inputs, :lock_version, :integer, default: 0, null: false
  end

  def self.down
    remove_column :campaign_inputs, :lock_version
    remove_column :package_inputs, :lock_version
    remove_column :placement_inputs, :lock_version
    remove_column :ad_inputs, :lock_version
    remove_column :creative_inputs, :lock_version
  end

end
