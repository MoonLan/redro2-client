const COMPONENTS_FACTORY_COMPONENTS = [
  {
    type: 'Account',
    enable: true,
    options: {
      initialCash: 100000
    }
  },
  {
    type: 'BiddingMarketReceiver',
    enable: true,
    options: {
      downstreamProvider: 'ComponentsBiddingMarket'
    }
  },
  {
    type: 'Inventory',
    enable: true,
    options: {
      hasStorageCost: true,
      storageCost: [
        {
          good: 'Engine',
          costPerBatch: 140
        },
        {
          good: 'Body',
          costPerBatch: 2800
        },
        {
          good: 'Wheel',
          costPerBatch: 1000
        }
      ],
      batchSize: 10,
      mode: 'PERIODIC'
    }
  },
  {
    type: 'IO',
    enable: true,
    options: {
      transportationTime: 120,
      transportationCost: 1400,
      batchSize: 4,
      availableImportGoods: [
        { good: 'Wheel' },
        { good: 'Body' },
        { good: 'Engine' }
      ],
      availableExportGoods: [
        { good: 'Wheel' },
        { good: 'Body' },
        { good: 'Engine' }
      ]
    }
  }
]

const ASSEMBLY_FACTORY_COMPONENTS = [
  {
    type: 'Account',
    enable: true,
    options: {
      initialCash: 100000
    }
  },
  {
    type: 'BiddingMarketReceiver',
    enable: true,
    options: {
      upstreamProvider: 'ComponentsBiddingMarket',
      downstreamProvider: 'CarsBiddingMarket'
    }
  },
  {
    type: 'Inventory',
    enable: true,
    options: {
      hasStorageCost: true,
      storageCost: [
        {
          good: 'Engine',
          costPerBatch: 2520
        },
        {
          good: 'Body',
          costPerBatch: 5040
        },
        {
          good: 'Wheel',
          costPerBatch: 1800
        },
        {
          good: 'Car',
          costPerBatch: 12000
        }
      ],
      batchSize: 10
    }
  },
  {
    type: 'IO',
    enable: true,
    options: {
      transportationTime: 120,
      transportationCost: 1400,
      batchSize: 4,
      availableImportGoods: [
        { good: 'Wheel' },
        { good: 'Body' },
        { good: 'Engine' }
      ],
      availableExportGoods: [{ good: 'Car' }]
    }
  }
]

const RETAILER_COMPONENTS = [
  {
    type: 'Account',
    enable: true,
    options: {
      initialCash: 100000
    }
  },
  {
    type: 'MarketReceiver',
    enable: true,
    options: {
      provider: 'Market'
    }
  },
  {
    type: 'BiddingMarketReceiver',
    enable: true,
    options: {
      upstreamProvider: 'CarsBiddingMarket'
    }
  },
  {
    type: 'Inventory',
    enable: true,
    options: {
      hasStorageCost: true,
      storageCost: [
        {
          good: 'Car',
          costPerBatch: 18000
        }
      ],
      batchSize: 10
    }
  },
  {
    type: 'IO',
    enable: true,
    options: {
      batchSize: 4,
      availableImportGoods: [{ good: 'Car' }],
      availableExportGoods: [{ good: 'Car' }]
    }
  }
]

export const NODES = [
  {
    name: 'ComponentsFactory-1',
    components: COMPONENTS_FACTORY_COMPONENTS,
    wage: 875,
    workers: 6
  },
  {
    name: 'ComponentsFactory-2',
    components: COMPONENTS_FACTORY_COMPONENTS,
    wage: 875,
    workers: 6
  },
  {
    name: 'ComponentsFactory-3',
    components: COMPONENTS_FACTORY_COMPONENTS,
    wage: 875,
    workers: 6
  },
  {
    name: 'ComponentsBiddingMarket',
    components: [
      {
        type: 'BiddingMarket',
        enable: true,
        options: {
          upstreams: [
            'ComponentsFactory-1',
            'ComponentsFactory-2',
            'ComponentsFactory-3'
          ],
          downstreams: [
            'AssemblyFactory-1',
            'AssemblyFactory-2',
            'AssemblyFactory-3'
          ],
          breakoffPaneltyRatio: 1.2,
          breakoffCompensationRatio: 1.2,
          transportationTime: 120,
          transportationStatus: 'DELIVERING',
          defaultTimeLimit: 600
        }
      },
      {
        type: 'Account',
        enable: true,
        options: {
          initialCash: 100000000
        }
      },
      { type: 'Inventory', enable: false },
      { type: 'IO', enable: false },
      {
        type: 'InventoryRegister',
        enable: true,
        options: {
          receivers: [
            'ComponentsFactory-1',
            'ComponentsFactory-2',
            'ComponentsFactory-3'
          ]
        }
      }
    ]
  },
  {
    name: 'AssemblyFactory-1',
    components: ASSEMBLY_FACTORY_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'AssemblyFactory-2',
    components: ASSEMBLY_FACTORY_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'AssemblyFactory-3',
    components: ASSEMBLY_FACTORY_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'AssemblyDepartment',
    components: [
      {
        type: 'AssemblyDepartment',
        enable: true,
        options: {
          receivers: [
            'AssemblyFactory-1',
            'AssemblyFactory-2',
            'AssemblyFactory-3'
          ],
          bom: [
            {
              good: 'Car',
              components: [
                {
                  good: 'Wheel',
                  unit: 4
                },
                {
                  good: 'Body',
                  unit: 1
                },
                {
                  good: 'Engine',
                  unit: 1
                }
              ]
            }
          ]
        }
      },
      {
        type: 'Account',
        enable: true,
        options: {
          initialCash: 100000000
        }
      },
      { type: 'Inventory', enable: false },
      { type: 'IO', enable: false }
    ]
  },
  {
    name: 'CarsBiddingMarket',
    components: [
      {
        type: 'BiddingMarket',
        enable: true,
        options: {
          upstreams: [
            'AssemblyFactory-1',
            'AssemblyFactory-2',
            'AssemblyFactory-3'
          ],
          downstreams: ['Retailer-1', 'Retailer-2', 'Retailer-3'],
          breakoffPaneltyRatio: 1.2,
          breakoffCompensationRatio: 1.2,
          transportationTime: 120,
          transportationStatus: 'DELIVERING',
          defaultTimeLimit: 600
        }
      },
      {
        type: 'Account',
        enable: true,
        options: {
          initialCash: 100000000
        }
      },
      { type: 'Inventory', enable: false },
      { type: 'IO', enable: false }
    ]
  },
  {
    name: 'Retailer-1',
    components: RETAILER_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'Retailer-2',
    components: RETAILER_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'Retailer-3',
    components: RETAILER_COMPONENTS,
    wage: 875,
    workers: 2
  },
  {
    name: 'Market',
    components: [
      {
        type: 'Market',
        enable: true,
        options: {
          upstreams: ['Retailer-1', 'Retailer-2', 'Retailer-3'],
          news: [
            {
              title: '中鋼進化，進軍國際產業鍊',
              content:
                '中鋼鋼鐵材料科技化再躍進，與23家國際車廠合作，站穩全球汽車用鋼供應鏈，目前裕隆納智捷（Luxgen5）車體高達92.6%由中鋼供料。車身品質在中鋼的努力下大幅提升，消費者對於這次國營企業的突破有信心，內需市場提升不少，30台的目標並非遙不可及。',
              banner: '/static/img/news/day1.jpg',
              releasedGameTime: {
                day: 1,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 15,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '車廠試圖提升淡季銷售量',
              content:
                '接近年尾，碰上買車的淡季，多家車廠紛紛加碼促銷，送機票、送竊盜險，甚至出現價值10多萬元的抽獎獎品回饋給消費者。針對此行銷策略，業者評估低迷的車市將會被炒熱，預估銷售量能夠提升三成。',
              banner: '/static/img/news/day2.jpg',
              releasedGameTime: {
                day: 2,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 28,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '買車新主張，業者預期買氣將提升',
              content:
                '但是隨著汽車電子化成為趨勢，消費者日益注重車內影音設備的品質及附加功能，產生了一波換車潮，可望有25%需求量的增長，上看單日需求量50台。',
              banner: '/static/img/news/day3.jpg',
              releasedGameTime: {
                day: 3,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 32,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '東協五國汽車需求轉強',
              content:
                '金融時報機密研究的調查顯示，按人口加權的東協五國汽車購買指數從去年第3季的56.9升到58.4。泰國受訪者的購車意願增強，是驅動這五國整體汽車購買指數變化的主力。在出口推動下，車廠預估會提升三成的出貨量。',
              banner: '/static/img/news/day4.jpg',
              releasedGameTime: {
                day: 4,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 60,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '為尋求低廉勞力，豐田預告進駐世界工廠',
              content:
                '豐田汽車公司表示，下一代小型轎車將在中國生產，有效降低車輛的平均生產成本，車價下跌，讓消費者大量購進家用轎車，市場需求成長接近2倍，單日需求量可望達到130台；不過，專家指出：全球兩大汽車巨擘美國福特（Ford）與德國福斯（Volkswagen）宣布，考慮策略結盟，並共同研發一系列商用車款。合作案凸顯全球車廠正積極結盟以搶攻市佔率，因此，豐田公司下修當日需求量為100台。',
              banner: '/static/img/news/day5.jpg',
              releasedGameTime: {
                day: 5,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 30,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '新興能源、政策推廣幫助青年購車',
              content:
                '近年來，美國能源業因為頁岩油技術研發的突破，不僅產能暴增、開採成本也大幅下降，經過商業性的流血競爭，美國頁岩油終於站穩境內的能源市場，導致油價下跌，再加上政府推出30歲以下年輕人的購車補助，使自用車需求量居高不下，可望有6成的新購車族的誕生。不過，專家表示汽車需求量已經達到高峰，供給商應改變經營政策。',
              banner: '/static/img/news/day6.jpg',
              releasedGameTime: {
                day: 6,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 20,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '石油危機再現，油價恐影響車市表現',
              content:
                '金融與能源之間的關係盤根錯節。石油輸出國組織於維也納召開的特別會議中，決定將原油日產量削減150萬桶，並暗示未來可能進一步減產。此消息流出導致油價大幅上漲，消費者對於日常車輛支出更加謹慎，因此需求量急遽下跌，僅剩25%的需求量。',
              banner: '/static/img/news/day7.jpg',
              releasedGameTime: {
                day: 7,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 40,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '大眾汽車安檢醜聞影響買氣',
              content:
                '環境保護署指控大眾汽車所售部分柴油車安裝了專門應對尾氣排放檢測的軟體，可以識別汽車是否處於被檢測狀態，繼而在車檢時秘密啟動，進而通過排氣檢驗，重挫消費者對於車業的信心，需求量繼續下滑至35台左右。',
              banner: '/static/img/news/day8.jpg',
              releasedGameTime: {
                day: 8,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 35,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '輕型汽車需求弱！新車銷量恐見萎縮',
              content:
                '汽車工會公布預測報告指出，因輕型汽車需求疲弱，拖累國內新車銷售量，將陷入萎縮。其中，銷售量受日產、SUBARU爆發品管瑕疵衝擊，預估需求量會減少至32台。',
              banner: '/static/img/news/day9.jpg',
              releasedGameTime: {
                day: 9,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 32,
                  unitPrice: 22000
                }
              ]
            },
            {
              title: '車市寒冬！景氣不佳，購車需求探底',
              content:
                '今年冬天不怎麼冷，不過汽車市場卻提前過寒冬，因為股市不好，油價上漲。不管是Toyota還是Nissan，最近車商都很緊張，因為市場急凍，需求量再次下跌，預估僅有30輛的成交。',
              banner: '/static/img/news/day10.jpg',
              releasedGameTime: {
                day: 10,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 30,
                  unitPrice: 22000
                }
              ]
            }
          ]
        }
      },
      {
        type: 'Account',
        enable: true,
        options: {
          initialCash: 100000000
        }
      },
      { type: 'Inventory', enable: true },
      {
        type: 'IO',
        enable: true,
        options: {
          availableImportGoods: [{ good: 'Car' }]
        }
      }
    ]
  }
]

export const PERMISSIONS = [
  {
    level: 'STAFF',
    teams: [
      {
        index: 0,
        name: 'Staff',
        roles: [
          {
            role: 'Console',
            name: 'GM',
            describe: 'GM',
            objectTypes: [
              { type: 'ComponentsFactory-1' },
              { type: 'ComponentsFactory-2' },
              { type: 'ComponentsFactory-3' },
              { type: 'ComponentsBiddingMarket' },
              { type: 'AssemblyFactory-1' },
              { type: 'AssemblyFactory-2' },
              { type: 'AssemblyFactory-3' },
              { type: 'AssemblyDepartment' },
              { type: 'CarsBiddingMarket' },
              { type: 'Retailer-1' },
              { type: 'Retailer-2' },
              { type: 'Retailer-3' },
              { type: 'Market' },
              { type: 'Engine' }
            ]
          },
          {
            role: 'Scoreboard',
            name: 'Scoreboard',
            describe: 'Scoreboard',
            objectTypes: [
              {
                type: 'ComponentsFactory-1',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'ComponentsFactory-2',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'ComponentsFactory-3',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'AssemblyFactory-1',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'AssemblyFactory-2',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'AssemblyFactory-3',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'Retailer-1',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'Retailer-2',
                listening: ['ACCOUNT_ADD']
              },
              {
                type: 'Retailer-3',
                listening: ['ACCOUNT_ADD']
              },
              { type: 'Engine' },
              { type: 'Server' }
            ]
          },
          {
            role: 'ComponentsBiddingMarket',
            name: 'ComponentsBiddingMarket',
            describe: 'ComponentsBiddingMarket',
            objectTypes: [
              { type: 'ComponentsFactory-1' },
              { type: 'ComponentsFactory-2' },
              { type: 'ComponentsFactory-3' },
              { type: 'ComponentsBiddingMarket' },
              { type: 'AssemblyFactory-1' },
              { type: 'AssemblyFactory-2' },
              { type: 'AssemblyFactory-3' },
              { type: 'Engine' }
            ]
          },
          {
            role: 'AssemblyDepartment',
            name: 'AssemblyDepartment',
            describe: 'AssemblyDepartment',
            objectTypes: [
              { type: 'AssemblyFactory-1' },
              { type: 'AssemblyFactory-2' },
              { type: 'AssemblyFactory-3' },
              { type: 'AssemblyDepartment' },
              { type: 'Engine' }
            ]
          },
          {
            role: 'CarsBiddingMarket',
            name: 'CarsBiddingMarket',
            describe: 'CarsBiddingMarket',
            objectTypes: [
              { type: 'AssemblyFactory-1' },
              { type: 'AssemblyFactory-2' },
              { type: 'AssemblyFactory-3' },
              { type: 'AssemblyDepartment' },
              { type: 'CarsBiddingMarket' },
              { type: 'Retailer-1' },
              { type: 'Retailer-2' },
              { type: 'Retailer-3' },
              { type: 'Engine' }
            ]
          },
          {
            role: 'Market',
            name: 'Market',
            describe: 'Market',
            objectTypes: [
              { type: 'Retailer-1' },
              { type: 'Retailer-2' },
              { type: 'Retailer-3' },
              { type: 'Market' },
              { type: 'Engine' }
            ]
          }
        ]
      }
    ]
  },
  {
    level: 'PLAYER',
    teams: [
      {
        index: 1,
        name: 'Team 1',
        roles: [
          {
            role: 'ComponentsFactory',
            name: 'ComponentsFactory',
            describe: 'ComponentsFactory',
            objectTypes: [{ type: 'ComponentsFactory-1' }, { type: 'Engine' }]
          },
          {
            role: 'AssemblyFactory',
            name: 'AssemblyFactory',
            describe: 'AssemblyFactory',
            objectTypes: [{ type: 'AssemblyFactory-1' }, { type: 'Engine' }]
          },
          {
            role: 'Retailer',
            name: 'Retailer',
            describe: 'Retailer',
            objectTypes: [{ type: 'Retailer-1' }, { type: 'Engine' }]
          }
        ]
      },
      {
        index: 2,
        name: 'Team 2',
        roles: [
          {
            role: 'ComponentsFactory',
            name: 'ComponentsFactory',
            describe: 'ComponentsFactory',
            objectTypes: [{ type: 'ComponentsFactory-2' }, { type: 'Engine' }]
          },
          {
            role: 'AssemblyFactory',
            name: 'AssemblyFactory',
            describe: 'AssemblyFactory',
            objectTypes: [{ type: 'AssemblyFactory-2' }, { type: 'Engine' }]
          },
          {
            role: 'Retailer',
            name: 'Retailer',
            describe: 'Retailer',
            objectTypes: [{ type: 'Retailer-2' }, { type: 'Engine' }]
          }
        ]
      },
      {
        index: 3,
        name: 'Team 3',
        roles: [
          {
            role: 'ComponentsFactory',
            name: 'ComponentsFactory',
            describe: 'ComponentsFactory',
            objectTypes: [{ type: 'ComponentsFactory-3' }, { type: 'Engine' }]
          },
          {
            role: 'AssemblyFactory',
            name: 'AssemblyFactory',
            describe: 'AssemblyFactory',
            objectTypes: [{ type: 'AssemblyFactory-3' }, { type: 'Engine' }]
          },
          {
            role: 'Retailer',
            name: 'Retailer',
            describe: 'Retailer',
            objectTypes: [{ type: 'Retailer-3' }, { type: 'Engine' }]
          }
        ]
      }
    ]
  }
]

export const SHORT_ENGINE_CONFIG = {
  name: 'Short Engine Testing',
  describe: '',
  gameDays: 2,
  dayLength: 10,
  nodes: NODES,
  permissions: PERMISSIONS
}

export const LONG_ENGINE_CONFIG = {
  name: 'Long Engine Testing',
  describe: '',
  gameDays: 5,
  dayLength: 10,
  nodes: NODES,
  permissions: PERMISSIONS
}
