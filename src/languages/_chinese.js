export default {
  cdp_page: {
    liquidation_price: '清算价格',
    // "liquidation_ratio": "Liquidation ratio",
    collateralization_ratio: '抵押率',
    // "current_price_information": "Current price information",
    liquidation_penalty: '清算罚金',
    minimum_ratio: '最低比率',
    stability_fee: '稳定费率',
    current_price_info: '当前价格信息',
    position: '仓位',
    // "collateral": "collateral",
    locked: '抵押中',
    // "required_for_safety": "Required for safety",
    able_withdraw: '可取回数量',
    available_generate: '可借数量',
    // "outstanding_debt": "Outstanding debt",
    // "wallet_balance": "wallet balance",
    tx_history: '金库历史',
    outstanding_dai_debt: '已借 Dai 数量',
    not_applicable: 'N/A'
  },
  landing_page: {
    headline: '一站式 Dai 交易、借贷、存款平台',
    trade_card: {
      title: 'Trade',
      description:
        "链上挂单撮合、即时结算、无手续费",
      button: '开始交易'
    },
    borrow_card: {
      title: 'Borrow',
      description:
        '抵押资产，借 Dai (与美元 1:1 锚定的稳定币)',
      button: '借 Dai'
    },
    save_card: {
      title: 'Save',
      description:
        '存 Dai 生息，随存随取',
      button: '存 Dai'
    },
    token_section_title: 'Oasis Trade 支持的交易对',
    token_section_only_on_trade: '* 只在 Oasis Trade 支持',
    section1_title: 'Oasis 是什么?',
    section1_p:
      'Oasis 是去中心化金融 (DeFi) 的一站式平台。你可以交易数字资产、借 Dai 和存 Dai 赚利息。',
    section2_title: '基于以太坊的安全协议',
    section2_p:
      'Oasis 是由 Maker 开发，基于以太坊创建、通过形式化验证和安全审计的智能合约，是去中心化金融领域的领导者。',
    section3_title: '完全无门槛',
    section3_p:
      'Oasis 是完全去中心化、无中心化托管的平台，通过以太坊钱包即可访问，资产永远掌握在用户自己手里。',
    questions_title: '常见问题',
    question1: 'Oasis 是什么?',
    answer1:
      'Oasis 是运行在以太坊区块链上的去中心化应用。任何人都可以在 Oasis 上交易数字资产、抵押借 Dai 并且存 Dai 生息。',
    question2: 'Dai 是什么?',
    answer2:
      'Dai 是全球第一个无偏见的去中心化稳定币，其价格和美元保持软锚定。了解 Dai：{0}',
    answer2_link1_url: 'https://makerdao.com/zh-CN/',
    answer2_link1_text: '更多内容',
    question3: '我需要注册账户吗?',
    answer3:
      '使用 Oasis，你不用注册账户，只需要通过以太坊钱包连接。Oasis 支持以下以太坊钱包: {0}, {1} 等。',
    answer3_link1_url: 'https://metamask.io/',
    answer3_link1_text: 'Metamask',
    answer3_link2_url: 'https://wallet.coinbase.com/',
    answer3_link2_text: 'Coinbase Wallet',
    question5: 'Oasis 安全吗?',
    answer5:
      'Oasis 具备最高的安全标准，并且经过日常的审计和形式化验证。此外, Oasis 是 {0} 协议，任何人都可以测试和审计。',
    answer5_link1_url: 'https://github.com/OasisDEX',
    answer5_link1_text: '开源',
    question6: '在 Oasis 上交易需要付手续费吗？',
    answer6:
      'Oasis 协议本身是完全免费的。在使用过程中，你仅需要支付以太坊矿工费。',
    question7: '如何联系 Oasis 团队?',
    answer7: '你可以通过 {0} 联系 Oasis 团队。',
    answer7_link1_url: 'https://chat.makerdao.com',
    answer7_link1_text: 'chat',
    question8:
      '我可以用银行卡在 Oasis 上购买比特币或者以太坊吗？',
    answer8:
      '你无法在 Oasis 用银行卡购买加密资产，你可以用 Dai 购买以太坊和其他资产。',
    read_only: 'Read-Only',
    wallet_connect: 'Wallet Connect',
    wallet_link: 'Coinbase Wallet'
  },
  overview_page: {
    title: '资产概览',
    your_cdps: '你的金库',
    token: '代币',
    id: '金库 ID',
    ratio: '当前比率',
    ratio_mobile: '当前比率',
    deposited: '已存入',
    withdraw: '可取回',
    debt: 'DAI',
    view_cdp: '查看金库',
    view_cdp_mobile: '查看',
    total_collateral_locked: '全部存入抵押品价值',
    total_dai_debt: '全部借 Dai 数量',
    get_started_title: '开启你的第一个金库，抵押生成 Dai',
    select_another_wallet: '选择其他钱包',
    connect_ledgers_choice: '连接 {0} 或者 {1}',
    no_vaults: '地址 {0} 下没有任何金库',
    vault_unavailable: '抱歉，该金库不可用',
    loading_vaults: '加载金库中...'
  },
  navbar: {
    save: '存款',
    borrow: '借贷',
    trade: '交易',
    privacy: '隐私政策',
    terms: '条款'
  },
  sidebar: {
    wallet_balances: '钱包余额',
    // "read_only_mode": "Read-Only Mode",
    price_feeds: '喂价',
    system_info: '系统信息',
    active_cdps: '金库总数',
    active_cdps_figure: '{0} 个金库',
    global_debt_ceiling: '全局债务上限',
    current_debt: '当前债务',
    base_rate: '全局抵押率',
    // "number_of_liquidations": "NUMBER OF LIQUIDATIONS",
    buy_and_burn_lot_size: '回购 & 销毁每手额度',
    inflate_and_sell_lot_size: '通胀 & 出售每手额度',
    system_collateralization: '抵押率',
    view_price_feeds: '查看喂价信息',
    view_mkr_tools: '查看系统信息',
    view_more: '展开',
    view_less: '收起',
    asset: '资产',
    balance: '余额',
    usd: 'USD',
    send: '发送',
    migrate: '去升级',
    no_wallet: '没有连接到钱包',
    save_details: {
      title: '存款详情',
      total_savings_dai: '全部存 Dai 数量',
      total_dai_supply: '全部 Dai 供给量',
      dai_savings_rate: 'Dai 存款利率'
    }
  },
  cdp_create: {
    screen_titles: {
      select_collateral: '选择抵押品',
      vault_management: '金库管理',
      generate_dai: '生成 Dai',
      confirmation: '确认'
    },
    set_allowance: '许可资产',
    seconds_wait_time: '秒',
    minutes_wait_time_singular: '分钟',
    minutes_wait_time_plural: '分钟',
    tx_hash: '交易哈希',
    view_tx_details: '查看交易细节',
    select_title: '选择一种抵押品类型',
    select_text:
      '每种抵押品有不同的风险参数，你可以存入不同的抵押品。',

    setup_proxy_title: '初始化金库和抵押品授权',
    setup_proxy_proxy_text:
      '一键初始化金库。本操作只需设置一次。',
    setup_proxy_allowance_text:
      '授权 {0} 资产。不同抵押品需要单独授权。',
    setup_proxy_proxy_button: '初始化',
    setup_proxy_allowance_button: '授权',
    setup_vault: '初始化金库',

    deposit_title: '抵押 {0} 并生成 Dai',
    deposit_text:
      '不同的抵押品类型有不同的风险参数和抵押率。',
    // "deposit_sidebar_title": "{0} Risk Parameters",
    deposit_form_field1_title:
      '你希望在金库中抵押多少 {0} ?',
    deposit_form_field1_text:
      '抵押 {0} 数量决定你可以生成的 Dai 数量。',
    // "deposit_form_field2_title": "What target collateralization ratio would you like to stay above?",
    // "deposit_form_field2_text": "If your Vault drops below this target it will be considered {0} risk.",
    // "deposit_form_field2_after": "Suggested:",
    deposit_form_field3_title: '你希望生成多少 Dai?',
    deposit_form_field3_text:
      '生成 Dai 的数量不能触及清算率。',
    // "deposit_form_field3_after1": "Max at target ratio",
    deposit_form_field3_after2: '最多可生成',

    confirm_title: '确认金库细节',
    confirmed_title: '你的金库正在创建中...',
    confirmed_text:
      '预计完成时间 {0}，你现在也可以安全离开这个页面。',
    post_confirmed_title: '你的金库已创建完成',
    post_confirmed_text: '你可以安全离开这个页面',
    insufficient_ilk_balance: '{0} 余额不足',
    has_understood_stability_fee:
      '我知晓稳定费率非固定，未来可能会变化',
    collateralization_warning:
      '你生成 Dai 的数量会让金库接近清算线风险',
    draw_too_much_dai: '金库将低于清算线',
    below_dust_limit: '金库初次最低借 {0} Dai',
    dust_max_payback:
      '你可以一次性偿还全部借出的 Dai, 或者最多 {0} Dai',
    stability_fee_description:
      '基于你的金库 Dai 债务累计的利息费。',
    liquidation_ratio_description:
      '清算率是指触发金库清算的最低抵押率（抵押品价值/借 Dai 债务）。',
    liquidation_penalty_description:
      '清算发生时，对借 Dai 债务额外收取的罚金。',
    waiting_for_comfirmations: '确认中... {0} / {1}',
    confirmed_with_confirmations: '已完成 {0} 确认',
    waiting_for_confirmations_info:
      "等待确认完成可以防止金库地址发生变动。我们建议用户等待10个确认完成，保证创建成功。该过程一般需要2分钟。",
    proxy_failure_not_mined: '本笔交易所需时间较长...',
    proxy_failure_not_mined_info:
      '交易时间受网络拥堵程度影响，或者选择的矿工费过低。有些钱包可以选择用更高矿工费重新发起交易，或者你可以在 Etherscan 查询交易状态，稍后返回查看进程。'
  },
  cdp_migrate: {
    select_title: '选择要映射的金库',
    select_text:
      '选择要映射的 CDP，用 DAI 或 MKR 偿还稳定费，映射到多抵押 Dai 和新的 CDP 面板。',
    current_ratio: '当前比率',
    dai_debt: '借 Dai 额',
    fee_in_dai: '以 DAI 计价的稳定费',
    fee_in_mkr: '以 MKR 计价的稳定费',
    migrate: '映射',
    payment: '支付',
    trust_site_with_dai: '信任当前网站',
    pay_and_migrate: '支付并映射',
    migrate_in_progress_header: '正在映射你的 CDP',
    migrate_in_progress_text:
      '整个过程大致需要 8 分钟。你现在也可以安全离开这个页面。',
    migrate_complete_header: 'CDP 映射完成',
    migrate_complete_text:
      'CDP #{0} 已经成功映射到多抵押 Dai 和新的 CDP 面板。',
    view_transaction_details: '查看交易细节',
    migrate_another_cdp: '映射另外的 CDP',
    exit_to_cdp_portal: '退出 CDP 面板'
  },
  dsr_deposit: {
    screen_titles: {
      open_vault: '开启存款金库',
      deposit_dai: '存 Dai',
      confirmation: '确认'
    },
    setup_header: '初始化金库',
    open_vault: '存 Dai 生息',
    deposit_form_title: '输入你希望存入的金额',
    setup_proxy_text:
      '一键初始化金库，本操作只需设置一次。',
    confirm_title: '确认存入'
    // "post_confirm_title": "Deposit Confirmed"
  },
  actions: {
    back: '返回',
    continue: '继续',
    create_cdp: '创建金库',
    deposit: '存入',
    withdraw: '取回',
    pay_back: '偿还',
    generate: '生成',
    send: '发送',
    skip: '跳过',
    get_started: '进入'
  },
  actions_past_tense: {
    deposit: '已存入',
    withdraw: '已取回',
    pay_back: '已偿还',
    generate: '已生成'
  },
  event_history: {
    open: '开启新的金库 ID #{0}',
    deposit: '存入 {0} {1} 到金库',
    dsr_deposit: '存入 {0} Dai',
    withdraw: '从金库取回 {0} {1}',
    dsr_withdraw: '取回 {0} Dai',
    generate: '从金库生成 {0} 新 Dai',
    pay_back: '偿还 {0} Dai 到金库',
    give: '金库转移从 {1} 转移到 {0}',
    migrate: '单抵押 Dai 已成功转移到金库'
  },
  action_sidebar: {
    deposit_title: '存入 {0}',
    deposit_description: '你希望存入多少 {0} ?',
    withdraw_title: '取回 {0}',
    withdraw_description: '你希望取回多少 {0} ?',
    withdraw_warning:
      '你取回的抵押品数量会让金库接近清算线风险',
    generate_title: '生成 DAI',
    generate_description: '你希望生成多少 DAI?',
    generate_warning:
      '你生成的 Dai 的数量会让金额接近清算线风险',
    payback_title: '偿还 DAI',
    payback_description: '你希望偿还多少 DAI?',
    cdp_below_threshold: '金库低于清算线',
    insufficient_balance: '{0} 余额不足',
    cannot_payback_more_than_owed: '无需偿还比借出还多的钱',
    dai_balance: '你的 Dai 余额',
    dai_debt: '已借 Dai 数量',
    locked_dsr: '存在 DSR 中',
    unlock_token: '授权 {0} 以继续',
    unlocking_token: '授权 {0} 中...',
    token_unlocked: '{0} 已授权',
    maximum_available_to_generate: '可生成最大数量',
    maximum_available_to_withdraw: '可借最大数量',
    current_account_balance: '当前余额',
    gem_usd_price_feed: '{0}/USD 喂价',
    new_liquidation_price: '新清算价格',
    new_collateralization_ratio: '新抵押率',
    create_proxy: '创建代理以继续',
    creating_proxy: '创建代理中...',
    proxy_created: '代理已创建',
    send_title: '发送 {0}',
    send_description: '你希望发送多少 {0}?',
    your_balance: '你的余额',
    dest_address: '收款地址',
    send_token_desc: '已发送 {0}',
    invalid_input: '输入值无效',
    invalid_min_amount: '只能发送大于零的 {0} 金额',
    invalid_max_amount: '余额不足',
    invalid_min_gas: '余额不足矿工费: {0}',
    invalid_max_gas: '余额不足转账金额+矿工费: {0}',
    invalid_address: '无效地址',
    invalid_allowance: '数量超过你对 {0} 的许可额'
  },
  save: {
    title: '存款余额',
    dai_savings_rate: 'Dai 存款利率',
    description:
      '存 Dai 生息，随存随取',
    deposit_amount: '存入金额',
    withdraw_amount: '提取金额',
    deposit_dai: '存入 Dai',
    deposit_dai_subheading:
      '存入即生息，随存随取',
    get_started_title: '现在开始存 Dai 赚 {0} 利息吧',
    start_earning:
      '存入 Dai 进行你的第一笔交易，开始赚利息',
    tx_history: '历史记录',
    savings_earned_to_date: '已赚利息',
    estimated_savings: '预计收益',
    dai_locked_dsr: '存在 DSR 中的 DAI',
    deposit_withdraw: '存入和取回',
    deposit_btn_cta: '实时获取收益',
    withdraw_btn_cta: '随时安全可取'
  },
  verbs: {
    depositing: '存入',
    generating: '生成',
    withdrawing: '取回'
  },
  table: {
    type: '类型',
    activity: '活动',
    date: '日期',
    time: '时间',
    sender_id: '发送者 ID',
    tx_hash: '交易哈希',
    loading: '加载中...'
  },
  transactions: {
    unlocking_token: '授权 {0}',
    setting_up_proxy: '设置代理',
    creating_cdp: '创建金库',
    generate_dai: '生成 DAI',
    pay_back_dai: '偿还 DAI',
    withdrawing_gem: '取出 {0}',
    depositing_gem: '存入 {0}',
    claiming_collateral: '赎回抵押品'
  },
  transaction_manager: {
    transaction_singular_capitalised: '交易',
    transaction_plural_capitalised: '交易',
    transaction_singular: '交易',
    transaction_plural: '交易',
    show: '显示',
    hide: '隐藏'
  },
  input_validations: {
    max_float: '金额需要小于 {0}',
    min_float: '金额需要大于 {0}',
    is_float: '请输入有效的数字',
    default: '请输入有效的信息'
  },
  connect: '连接',
  view: '查看',
  exit: '退出',
  close: '关闭',
  connect_to: '连接 {0}',
  overview: '概览',
  cdp_type: '金库类型',
  not_found: '未找到',
  // "network": "Network",
  // "unknown": "Unknown",
  cdp: '金库',
  cdp_id: '金库 ID',
  // "connect": "Connect",
  set_max: '最大值',
  paste: '粘贴',
  cancel: '取消',
  current_price: '当前价格',
  stability_fee: '稳定费率',
  liquidation_penalty: '清算罚金',
  collateral_debt_ceiling: '债务上限',
  dai_available: '可用 DAI',
  returned_auction: '拍卖返还额',
  liquidated_event: '你的金库已经被清算',
  liquidation_ratio: '清算线',
  liquidation_price: '清算价格',
  liquidation_penalty_shortened: '清算罚金',
  liquidation_ratio_shortened: '清算线',
  // "liquidation_price_shortened": "Liq Price",
  collateral_type: '抵押品类型',
  collateralization: '抵押率',
  collateralization_ratio: '抵押率',
  current_ilk_price: '当前 {0} 价格',
  your_balance: '你的余额',
  // "risk_parameters": "Risk Parameters",
  terms_of_service_text: '我已经阅读并接受 {0}',
  terms_of_service: '服务条款',
  cookie_notice: '同意该网站 {0}',
  privacy_policy: '隐私政策',
  providers: {
    connect_wallet: '选择钱包连接',
    metamask: 'MetaMask',
    trust: 'Trust',
    coinbase: 'Coinbase Wallet',
    imtoken: 'imToken',
    alphawallet: 'Alpha Wallet',
    ledger_nano: 'Ledger Nano',
    trezor: 'Trezor',
    other: '当前钱包',
    ledger: 'Ledger',
    walletconnect: 'Wallet Connect'
  },
  notifications: {
    claim: '赎回',
    claim_collateral:
      '你的 {0} Vault 拍卖已经完成。你可以赎回 {1} {2}。',
    non_vault_owner:
      '金库 ({0}) 持有者和当前钱包地址不匹配。',
    non_overview_owner:
      '你目前在查看其他地址 ({0}) 的账户概览。'
  }
};
