class AdInput < ApplicationRecord
  after_initialize :set_ad_input_tag

  belongs_to :placement_input
  belongs_to :creative_group
  has_many :creative_inputs, dependent: :delete_all

  validates_presence_of :placement_input, :creative_group

  private

  def set_ad_input_tag
    if !self.ad_input_tag
      c = placement_input.package_input.campaign_input
      self.ad_input_tag = [
        c.network.abbrev,
        c.program.abbrev,
        c.season.abbrev,
        creative_group.abbrev,
        placement_input.package_input.publisher.abbrev,
        !placement_input.ad_type.video? ? "#{placement_input.width}x#{placement_input.height}" : nil,
        self.custom
      ].compact().join('_')
    end
  end
end
