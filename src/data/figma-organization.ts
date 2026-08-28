// Figma Make v12 demo snapshot. Counts are source summaries; members are sample rows.
export interface GroupMember {
  id: string;
  name: string;
  code: string;
  position: string;
  level: string;
  joinDate: string;
  accountStatus: 'opened' | 'unopened' | 'frozen';
  loginAccount: string;
  onboardingDocs: 'completed' | 'pending' | 'not_applicable';
  kpiRate: number | null; // Newly added demo members have no performance data yet.
}

export interface GroupNode {
  id: string;
  groupName: string;
  leader: {
    name: string;
    code: string;
    position: string;
    level: string;
    kpiRate: number;
  };
  memberCount: number;
  members: GroupMember[];
}

export interface SingleDepartmentDemo {
  deptName: string;
  totalCount: number;
  manager: {
    name: string;
    code: string;
    position: string;
    level: string;
    phone: string;
    email: string;
    kpiRate: number;
  };
  groups: GroupNode[];
}

export const demoDepartmentData: SingleDepartmentDemo = {
  deptName: '鲜花美团运营部',
  totalCount: 36,
  manager: {
    name: '田靖',
    code: 'E000050',
    position: '运营部经理',
    level: 'P9-2',
    phone: '138****8821',
    email: 'tianjing@shangyi.com',
    kpiRate: 94
  },
  groups: [
    {
      id: 'grp-cs',
      groupName: '客服组',
      leader: {
        name: '陈若溪',
        code: 'E000128',
        position: '客服组长',
        level: 'P6-2',
        kpiRate: 92
      },
      memberCount: 6,
      members: [
        {
          id: 'm-cs-1',
          name: '李佳美',
          code: 'E000212',
          position: '资深客服专员',
          level: 'P5-1',
          joinDate: '2022-05-10',
          accountStatus: 'opened',
          loginAccount: 'lijiamei@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 98
        },
        {
          id: 'm-cs-2',
          name: '郭宝琳',
          code: 'E000214',
          position: '在线客服专员',
          level: 'P4-3',
          joinDate: '2023-02-18',
          accountStatus: 'opened',
          loginAccount: 'guobaolin@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 85
        },
        {
          id: 'm-cs-3',
          name: '赵文静',
          code: 'E000216',
          position: '售后处理专员',
          level: 'P4-2',
          joinDate: '2023-08-01',
          accountStatus: 'unopened',
          loginAccount: '未开通',
          onboardingDocs: 'pending',
          kpiRate: 62
        }
      ]
    },
    {
      id: 'grp-inspect',
      groupName: '新商督查组',
      leader: {
        name: '张立强',
        code: 'E000155',
        position: '新商督查组长',
        level: 'P7-3',
        kpiRate: 88
      },
      memberCount: 5,
      members: [
        {
          id: 'm-ins-1',
          name: '李浩宇',
          code: 'E000189',
          position: '高级督查专员',
          level: 'P5-2',
          joinDate: '2023-01-05',
          accountStatus: 'opened',
          loginAccount: 'lihaoyu@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 91
        },
        {
          id: 'm-ins-2',
          name: '王雪莲',
          code: 'E000210',
          position: '新商巡检专员',
          level: 'P5-1',
          joinDate: '2023-04-12',
          accountStatus: 'unopened',
          loginAccount: '未开通',
          onboardingDocs: 'pending',
          kpiRate: 75
        },
        {
          id: 'm-ins-3',
          name: '宋天明',
          code: 'E000218',
          position: '合规审核专员',
          level: 'P5-3',
          joinDate: '2022-11-20',
          accountStatus: 'opened',
          loginAccount: 'songtianming@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 82
        }
      ]
    },
    {
      id: 'grp-op4',
      groupName: '运营四组',
      leader: {
        name: '周林',
        code: 'E000088',
        position: '运营四组组长',
        level: 'P8-1',
        kpiRate: 95
      },
      memberCount: 10,
      members: [
        {
          id: 'm-op4-1',
          name: '刘成',
          code: 'E000215',
          position: '资深美团运营',
          level: 'P6-1',
          joinDate: '2021-12-01',
          accountStatus: 'opened',
          loginAccount: 'liucheng@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 96
        },
        {
          id: 'm-op4-2',
          name: '钱雅平',
          code: 'E000222',
          position: '商家活动运营',
          level: 'P5-3',
          joinDate: '2022-09-15',
          accountStatus: 'opened',
          loginAccount: 'qianyaping@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 84
        },
        {
          id: 'm-op4-3',
          name: '孙可欣',
          code: 'E000226',
          position: '流量投放专员',
          level: 'P5-2',
          joinDate: '2023-03-20',
          accountStatus: 'opened',
          loginAccount: 'sunkexin@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 78
        }
      ]
    },
    {
      id: 'grp-op5',
      groupName: '运营五组',
      leader: {
        name: '魏大勇',
        code: 'E000105',
        position: '运营五组组长',
        level: 'P8-1',
        kpiRate: 81
      },
      memberCount: 8,
      members: [
        {
          id: 'm-op5-1',
          name: '薛天宇',
          code: 'E000230',
          position: '美团大促运营',
          level: 'P6-1',
          joinDate: '2022-07-10',
          accountStatus: 'opened',
          loginAccount: 'xuetianyu@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 89
        },
        {
          id: 'm-op5-2',
          name: '郑美如',
          code: 'E000235',
          position: '数据分析专员',
          level: 'P5-2',
          joinDate: '2023-05-18',
          accountStatus: 'opened',
          loginAccount: 'zhengmeiru@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 70
        },
        {
          id: 'm-op5-3',
          name: '彭嘉豪',
          code: 'E000238',
          position: '渠道拓展专员',
          level: 'P5-1',
          joinDate: '2023-09-01',
          accountStatus: 'unopened',
          loginAccount: '未开通',
          onboardingDocs: 'pending',
          kpiRate: 55
        }
      ]
    },
    {
      id: 'grp-op6',
      groupName: '运营六组',
      leader: {
        name: '钱宏发',
        code: 'E000012',
        position: '运营六组组长',
        level: 'P7-1',
        kpiRate: 76
      },
      memberCount: 7,
      members: [
        {
          id: 'm-op6-1',
          name: '方海博',
          code: 'E000240',
          position: '小时达对接运营',
          level: 'P5-3',
          joinDate: '2022-10-12',
          accountStatus: 'opened',
          loginAccount: 'fanghaibo@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 83
        },
        {
          id: 'm-op6-2',
          name: '董晓亮',
          code: 'E000245',
          position: '品牌联动专员',
          level: 'P5-1',
          joinDate: '2023-06-01',
          accountStatus: 'opened',
          loginAccount: 'dongxiaoliang@shangyi.com',
          onboardingDocs: 'completed',
          kpiRate: 74
        },
        {
          id: 'm-op6-3',
          name: '许思涵',
          code: 'E000248',
          position: '运营助理专员',
          level: 'P4-3',
          joinDate: '2023-11-15',
          accountStatus: 'unopened',
          loginAccount: '未开通',
          onboardingDocs: 'pending',
          kpiRate: 48
        }
      ]
    }
  ]
};
