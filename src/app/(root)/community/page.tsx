import Filter from "@/features/filters/components/Filter";
import Search from "@/features/search";
import { getUsers } from "@/features/user/actions/get-users.action";
import UserCard from "@/features/user/components/user-card";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import { UserFilters } from "@/shared/constants/filters";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_USERS } from "@/shared/constants/states";
import type { RouteParams } from "@/shared/types/global";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <div>
      <Heading>All Users</Heading>
      <div className="mt-11">
        <Search
          route={ROUTES.COMMUNITIES}
          placeholder="There are great developers here!"
        />
        <Filter filters={UserFilters} />
      </div>

      <DataRenderer
        success={success}
        error={error}
        empty={EMPTY_USERS}
        data={users}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
