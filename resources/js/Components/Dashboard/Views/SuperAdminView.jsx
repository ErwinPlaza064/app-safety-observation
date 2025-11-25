import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";

export default function SuperAdminView({ stats, users, onUserClick }) {
    return (
        <div className="space-y-6">
            {stats && <StatsCards stats={stats} />}
            {users && <UsersTable users={users} onUserClick={onUserClick} />}
        </div>
    );
}
