import { randomBytes } from 'crypto';

// Helper function to generate a secure random token
const secureRandom = () => {
  return randomBytes(16).toString('hex');
};

const voipCallDirection = ['inbound', 'outbound'];

export const createRoom = ({
  name,
  type,
  username,
  token,
  members,
  agentId,
  credentials: customCredentials,
  extraData,
  voipCallDirection = 'inbound',
}: CreateRoomParams) => {
  const roomId = secureRandom(); // Use secure random ID generation

  return {
    _id: roomId,
    name: name || `Room-${secureRandom()}`, // Secure random name fallback
    type,
    username,
    token: token || secureRandom(), // Secure random token fallback
    members,
    agentId,
    credentials: customCredentials,
    extraData,
    voipCallDirection: voipCallDirection,
  };
};

// Additional code can go here
