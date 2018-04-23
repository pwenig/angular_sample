class AddColumnToRequests < ActiveRecord::Migration[5.1]
  def change
    add_column :requests, :requestor_email, :string
    add_column :requests, :comments, :text
    change_column :requests, :status, :string, null: true
  end
end
