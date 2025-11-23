# Sports Club Management System - Documentation

This directory contains comprehensive documentation for the Sports Club Management System.

## Core Documentation

### [Membership Approval System](./MEMBERSHIP_APPROVAL_SYSTEM.md) 🆕
Complete guide to the membership approval workflow including:
- System architecture and flow diagrams
- Database schema and RLS policies
- API functions and examples
- UI components and user guides
- Troubleshooting and migration guides

### [Membership Registration Guide](./MEMBERSHIP_REGISTRATION_GUIDE.md)
Detailed guide for the membership registration process.

### [Membership Technical Documentation](./MEMBERSHIP_TECHNICAL_DOCS.md)
Technical specifications and implementation details for the membership system.

### [Membership Helper Functions](./MEMBERSHIP_HELPER_FUNCTIONS.md)
Documentation for database helper functions used in the membership system.

## Access Control & Security

### [Athlete Access Restrictions](./ATHLETE_ACCESS_RESTRICTIONS.md)
Details on how athlete access is controlled based on membership status.

### [Leave Requests RLS Policies](./LEAVE_REQUESTS_RLS_POLICIES.md)
Row-Level Security policies for the leave requests feature.

## Performance & Optimization

### [Index Optimization Report](./INDEX_OPTIMIZATION_REPORT.md)
Database index analysis and optimization recommendations.

### [Training Attendance Index Reference](./TRAINING_ATTENDANCE_INDEX_REFERENCE.md)
Index specifications for the training attendance system.

## Quick Links

### For New Users
1. Start with [Membership Approval System](./MEMBERSHIP_APPROVAL_SYSTEM.md)
2. Review user guides for your role (athlete/coach/admin)
3. Check troubleshooting section if you encounter issues

### For Developers
1. Review [Membership Technical Documentation](./MEMBERSHIP_TECHNICAL_DOCS.md)
2. Check [Membership Helper Functions](./MEMBERSHIP_HELPER_FUNCTIONS.md)
3. Review RLS policies in respective documents
4. See [Index Optimization Report](./INDEX_OPTIMIZATION_REPORT.md) for performance

### For Administrators
1. Read [Membership Approval System](./MEMBERSHIP_APPROVAL_SYSTEM.md) - Admin section
2. Review [Athlete Access Restrictions](./ATHLETE_ACCESS_RESTRICTIONS.md)
3. Check migration guides for deployment

## Documentation Structure

```
docs/
├── README.md (this file)
├── MEMBERSHIP_APPROVAL_SYSTEM.md       # Main approval workflow
├── MEMBERSHIP_REGISTRATION_GUIDE.md    # Registration process
├── MEMBERSHIP_TECHNICAL_DOCS.md        # Technical specs
├── MEMBERSHIP_HELPER_FUNCTIONS.md      # Database functions
├── ATHLETE_ACCESS_RESTRICTIONS.md      # Access control
├── LEAVE_REQUESTS_RLS_POLICIES.md      # Leave request security
├── INDEX_OPTIMIZATION_REPORT.md        # Performance tuning
└── TRAINING_ATTENDANCE_INDEX_REFERENCE.md  # Attendance indexes
```

## Related Documentation

- **Spec Documents:** `.kiro/specs/membership-approval-fix/`
  - `requirements.md` - System requirements
  - `design.md` - Design specifications
  - `tasks.md` - Implementation tasks

- **Database Scripts:** `scripts/`
  - Migration scripts (31-38)
  - Verification scripts
  - Helper function definitions

- **Test Files:** `tests/`
  - Unit tests
  - Integration tests
  - Property-based tests

## Getting Help

1. **Search this documentation** for your topic
2. **Check troubleshooting sections** in relevant docs
3. **Review test files** for usage examples
4. **Check code comments** in source files
5. **Contact development team** if issues persist

## Contributing to Documentation

When adding new features:
1. Update relevant documentation files
2. Add diagrams where helpful (use Mermaid)
3. Include code examples
4. Add troubleshooting tips
5. Update this README if adding new docs

---

**Last Updated:** November 23, 2024  
**Maintained By:** Development Team
