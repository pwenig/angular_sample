class MetadataService
  require 'json'

  def self.get_data
    metaobject = {}
    metaobject['networks'] = get_networks
    metaobject['seasons'] = get_seasons
    metaobject['campaigns'] = get_campaigns
    metaobject['campaign_types'] = get_campaign_types
    metaobject
  end

  def self.get_networks
    networks = Network.all
    networks.as_json(
      except: [
        :id, :created_at, :updated_at
      ],
      include: {
        programs: {
          except: [:id, :created_at, :updated_at, :network_id]
        }
      })
  end

  def self.get_seasons 
    seasons = Season.all
    seasons.as_json(
      except: [
        :id, :created_at, :updated_at
      ]
    )
  end 

  def self.get_campaigns 
    campaigns = Campaign.all
    campaigns.as_json(
      except: [
        :id, :created_at, :updated_at
      ]
    )
  end 
  
  def self.get_campaign_types
    campaign_types = CampaignType.all
    campaign_types.as_json(
      except: [
        :id, :created_at, :updated_at
      ]
    )
  end 
  
end
