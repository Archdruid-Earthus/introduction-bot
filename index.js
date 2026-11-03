const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// These will be filled from Railway (don't put real values here)
const INTRO_CHANNEL_ID = process.env.INTRO_CHANNEL_ID;
const COMMUNITY_ROLE_ID = process.env.COMMUNITY_ROLE_ID;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('threadCreate', async (thread) => {
  if (thread.parentId !== INTRO_CHANNEL_ID) return;
  if (thread.parent?.type !== ChannelType.GuildForum) return;

  try {
    const member = await thread.guild.members.fetch(thread.ownerId);
    const role = thread.guild.roles.cache.get(COMMUNITY_ROLE_ID);

    if (!role) {
      console.log('Community Member role not found');
      return;
    }

    // Already has the role → do nothing
    if (member.roles.cache.has(role.id)) {
      console.log(`${member.user.tag} already has the role`);
      return;
    }

    // First time → give the role
    await member.roles.add(role);
    console.log(`First intro from ${member.user.tag} → gave Community Member role`);
  } catch (err) {
    console.error('Error:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
