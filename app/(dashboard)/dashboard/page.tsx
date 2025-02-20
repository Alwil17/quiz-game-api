import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getTeamForUser } from '@/lib/db/queries';
import { getUser } from '@/lib/service/user.service';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error('Team not found');
  }

  return <Settings teamData={teamData} />;
}
