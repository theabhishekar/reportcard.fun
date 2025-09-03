# 🏛️ Civic Issues Database

A **free, unlimited database** for civic issues using GitHub Issues with automated analytics and community insights.

## 🎯 What This Is

This repository serves as a **centralized database** for all civic issue reports from [reportcard.fun](https://reportcard.fun). Instead of expensive backend infrastructure, we use **GitHub Issues as a free database** with automated analytics processing.

## 🚀 Features

- **📊 Unlimited Storage** - Store millions of civic reports for free
- **🤖 Automated Analytics** - GitHub Actions process data every 6 hours
- **📈 Real-time Dashboard** - Live statistics and insights
- **🏷️ Smart Categorization** - Automatic labeling by issue type and location
- **🔍 Search & Filter** - Built-in GitHub search capabilities
- **📱 Community Insights** - Track trends and hotspots
- **💰 Zero Cost** - Completely free forever!

## 🏗️ How It Works

### Data Flow
```
User generates certificate → GitHub Issues API → Issue created → Analytics processed → Dashboard updated
```

### Storage Structure
Each civic report becomes a GitHub issue with:
- **Title**: Issue type + location
- **Body**: Structured data (type, location, date, notes, etc.)
- **Labels**: Categorization (issue-type, location, year, etc.)
- **State**: Open (active) or Closed (resolved)

## 📊 Analytics Dashboard

The system automatically generates:
- **Total reports count**
- **Issue type distribution**
- **Geographic hotspots**
- **User activity tracking**
- **Daily activity trends**
- **Top contributors**

## 🛠️ Technical Stack

- **Database**: GitHub Issues (unlimited, free)
- **Automation**: GitHub Actions (2,000 free minutes/month)
- **Processing**: Node.js scripts
- **Analytics**: JSON data files
- **Frontend**: React dashboard component

## 🚀 Getting Started

### For Users
1. **Visit [reportcard.fun](https://reportcard.fun)**
2. **Report a civic issue** (pothole, garbage, etc.)
3. **Generate certificate** with photo and location
4. **Your report is automatically stored** in this database
5. **View community analytics** and insights

### For Developers
1. **Clone this repository**
2. **Install dependencies**: `npm install`
3. **Run analytics**: `npm run analytics`
4. **View generated data** in `analytics/` folder

## 📁 Repository Structure

```
civic-issues-database/
├── .github/
│   └── workflows/
│       └── analytics.yml          # Automated analytics
├── scripts/
│   ├── analytics.js               # Data processing
│   ├── create-summary.js          # Summary generation
│   └── comment-analytics.js       # Issue comments
├── analytics/                     # Generated analytics files
│   ├── summary.json
│   ├── issue-types.json
│   ├── locations.json
│   └── daily-activity.json
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔧 Automation

### GitHub Actions Workflow
- **Triggers**: Every 6 hours, on issue events
- **Processes**: All civic reports
- **Generates**: Analytics and summaries
- **Updates**: Dashboard data automatically

### Analytics Generation
- **Frequency**: Every 6 hours
- **Data**: All issues in repository
- **Output**: JSON files + Markdown summary
- **Storage**: Committed to repository

## 📈 Scaling

### Current Limits
- **GitHub Issues**: Unlimited
- **GitHub Actions**: 2,000 minutes/month (free)
- **Repository size**: 1GB (sufficient for metadata)
- **API rate limits**: 5,000 requests/hour

### Future Scaling
- **Multiple repositories** for different regions
- **Advanced analytics** with external tools
- **Real-time processing** with webhooks
- **Machine learning** insights

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Use GitHub Issues for bugs or feature requests
2. **Submit Pull Requests**: Improve the analytics or automation
3. **Share Ideas**: Suggest new features or improvements
4. **Spread the Word**: Tell others about this free civic tech solution

## 🔒 Privacy & Security

- **No personal information** stored
- **Anonymous user IDs** only
- **Public repository** for transparency
- **Community-driven** data sharing
- **Read-only access** for public data

## 📞 Support

- **GitHub Issues**: Use this repository for questions
- **Documentation**: Check the [setup guide](GITHUB_SETUP.md)
- **Community**: Engage with civic tech community
- **Contributions**: Welcome pull requests and improvements

## 🎉 Benefits

### For Citizens
- **Transparent data storage**
- **Community insights**
- **Issue tracking**
- **Impact measurement**

### For Government
- **Data-driven decision making**
- **Resource allocation**
- **Accountability tracking**
- **Policy influence**

### For Community
- **Data-driven advocacy**
- **Government accountability**
- **Resource allocation**
- **Policy influence**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub** for providing free unlimited storage
- **GitHub Actions** for free automation
- **Community** for contributing reports and insights
- **Open source** community for inspiration

---

**This system gives you enterprise-level analytics capabilities at $0/month cost!** 🎯

*Made with ❤️ by [@Mehonestperson](https://twitter.com/Mehonestperson)*

---

**🔗 Links:**
- 🌐 [Live App](https://reportcard.fun)
- 📊 [Analytics Dashboard](https://github.com/ScienceArtist/civic-issues-database/blob/main/analytics/summary.md)
- 🚀 [Setup Guide](GITHUB_SETUP.md)
- 💰 [Support the Project](https://buymeacoffee.com/mehonestperson)
