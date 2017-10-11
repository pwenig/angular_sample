Rails.application.routes.draw do
  namespace :admin do
    resources :users
    resources :agencies
    resources :networks
    resources :programs
    resources :seasons
    resources :campaigns
    resources :campaign_types
    resources :publishers

    root to: "users#index"
  end
  
  root 'pages#index'
  resources :metadata, only: [:index]
  resources :campaign_inputs
  devise_for :users

  # Cleaning up devise routes
  as :user do
    get 'signin' => 'pages#index'
    get 'invite' => 'devise/invitations#new'
    
   
  end

  # Redirects routes to index if a wrong route is entered.
  get '*path' => redirect('/')

end
