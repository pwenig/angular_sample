class CreatePrograms < ActiveRecord::Migration[5.1]
  def change
    create_table :programs do |t|
      t.string :name
      t.string :abbrev
      t.references :network, foreign_key: true

      t.timestamps
    end
  end
end
