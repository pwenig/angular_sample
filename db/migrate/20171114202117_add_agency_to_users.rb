class AddAgencyToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :agency, foreign_key: true
  end
end
