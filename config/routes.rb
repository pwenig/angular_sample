Rails.application.routes.draw do
  namespace :admin do
    resources :abtest_labels
    resources :ad_types
    resources :agencies
    resources :buy_methods
    resources :campaign_types
    resources :creative_groups
    resources :creative_messages
    resources :devices
    resources :episodes
    resources :inventory_types
    resources :networks
    resources :programs
    resources :publishers
    resources :seasons
    resources :tactics
    resources :targeting_types
    resources :video_lengths
    resources :users
    root 'users#index'
  end

  root 'pages#index'
  resources :metadata, only: [:index]
  resources :campaign_inputs
  resources :package_inputs
  resources :placement_inputs
  resources :ad_inputs
  resources :creative_inputs
  resources :requests
  post 'requests/filter' => 'requests#filter'
  # as :requests do
  #   get 'requests' => 'requests#new'
  # end

  devise_for :users
  # Cleaning up devise routes
  as :user do
    get 'signin' => 'pages#index'
    get 'invite' => 'devise/invitations#new'


  end

  # Redirects routes to index if a wrong route is entered.
  get '*path' => redirect('/')

end
