class PackageInput < ApplicationRecord
  after_initialize :set_custom, :set_package_input_tag

  belongs_to :campaign_input
  belongs_to :agency
  belongs_to :publisher
  belongs_to :buy_method
  belongs_to :inventory_type

  has_many :placement_inputs, dependent: :delete_all

  validates_presence_of :campaign_input
  validates_presence_of :agency
  validates_presence_of :publisher
  validates_presence_of :buy_method
  validates_presence_of :inventory_type

  private

  def set_custom
    if !self.custom
      self.custom = 'XX'
    end
  end

  def set_package_input_tag
    if !self.package_input_tag
      self.package_input_tag = [
        campaign_input.network.abbrev,
        campaign_input.program.abbrev,
        campaign_input.season.abbrev,
        agency.abbrev,
        publisher.abbrev,
        buy_method.abbrev,
        inventory_type.abbrev,
        custom
      ].compact().join("_")
    end
  end
end
