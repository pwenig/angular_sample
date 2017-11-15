FactoryGirl.define do
  factory :user do
    email 'testuser@example.com'
    password 'MyPassword'
    agency Agency.create!(name: 'Foo', abbrev: 'foo')
  end

  factory :network do
    name 'Comedy Central'
    abbrev 'CCL'
  end

  factory :campaign_type do
    name 'Binge'
    abbrev 'BG'
  end

  factory :season do
    name 'S00'
    abbrev 's00'
  end

  factory :agency do
    name 'Sterling Cooper'
    abbrev 'SC'
  end

  factory :publisher do
    name 'ABC'
    abbrev 'ABCX'
  end

  factory :buy_method do
    name 'CPA'
    abbrev 'CPA'
  end

  factory :inventory_type do
    name 'Partner Social Distribution'
    abbrev 'PSD'
  end
end
