class AddColumn < ActiveRecord::Migration[5.1]
  def change
    add_column :inventory_types, :definition, :text
    add_column :ad_types, :definition, :text
    add_column :targeting_types, :definition, :text
    add_column :creative_groups, :definition, :text
  end
end
