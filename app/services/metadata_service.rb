class MetadataService
  require 'json'

  def self.fetch_data
    metaobject = {}
    metaobject['networks'] = fetch_networks
    metaobject['seasons'] = fetch_seasons
    metaobject['campaigns'] = fetch_campaigns
    metaobject['campaign_types'] = fetch_campaign_types
    metaobject
  end

  def self.fetch_networks
    Network.all.as_json(
      except: %i[
        created_at updated_at
      ],
      include: {
        programs: {
          except: %i[created_at updated_at network_id]
        }
      }
    )
  end

  def self.fetch_seasons
    Season.all.as_json(
      except: %i[
        created_at updated_at
      ]
    )
  end

  def self.fetch_campaigns
    Campaign.all.as_json(
      except: %i[
        created_at updated_at
      ]
    )
  end

  def self.fetch_campaign_types
    CampaignType.all.as_json(
      except: %i[
        created_at updated_at
      ]
    )
  end
end
