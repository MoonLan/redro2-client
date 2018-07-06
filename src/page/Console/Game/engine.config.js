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
          costPerBatch: 1400
        },
        {
          good: 'Body',
          costPerBatch: 2800
        },
        {
          good: 'Wheel',
          costPerBatch: 700
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
      initialCash: 150000
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
          costPerBatch: 1867
        },
        {
          good: 'Body',
          costPerBatch: 3733
        },
        {
          good: 'Wheel',
          costPerBatch: 944
        },
        {
          good: 'Car',
          costPerBatch: 5600
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
      initialCash: 50000
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
          costPerBatch: 8400
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
          transportationStatus: 'DELIVERING'
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
          transportationStatus: 'DELIVERING'
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
              title: 'Sample News Day1',
              content: 'Haha...',
              releasedGameTime: {
                day: 1,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 20,
                  unitPrice: 17000
                }
              ]
            },
            {
              title: 'Sample News Day2',
              content: 'Haha... Day 2 is coming',
              releasedGameTime: {
                day: 2,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 40,
                  unitPrice: 17000
                }
              ]
            },
            {
              title: 'Sample News Day3',
              content: 'Haha... Day 3 is coming',
              releasedGameTime: {
                day: 3,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 50,
                  unitPrice: 17000
                }
              ]
            },
            {
              title: 'Sample News Day4',
              content: 'Haha... Day 4 is coming',
              releasedGameTime: {
                day: 4,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 95,
                  unitPrice: 17000
                }
              ]
            },
            {
              title: 'Sample News Day5',
              content: 'Haha... Day 5 is coming',
              releasedGameTime: {
                day: 5,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 45,
                  unitPrice: 15000
                }
              ]
            },
            {
              title: 'Sample News Day6',
              content: 'Haha... Day 6 is coming',
              releasedGameTime: {
                day: 6,
                time: 0,
                isWorking: true
              },
              marketNeeds: [
                {
                  good: 'Car',
                  unit: 40,
                  unitPrice: 15000
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
