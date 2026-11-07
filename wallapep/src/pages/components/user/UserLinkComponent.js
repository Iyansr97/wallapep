import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { getPublicUser, userDisplayName, getMyId } from "../../../utils/UtilsUsers";

const avatarColors = ["#f56a00", "#7265e6", "#00a2ae", "#87d068", "#eb2f96", "#1677ff", "#fa8c16"];

export let UserAvatarComponent = ({ user, userId, size = "small" }) => {
    let initial = userDisplayName(user)?.charAt(0).toUpperCase() ?? "?";
    return (
        <Avatar size={size} style={{ backgroundColor: avatarColors[userId % avatarColors.length], flexShrink: 0 }}>
            {initial}
        </Avatar>
    );
}

let UserLinkComponent = ({ userId }) => {
    let [user, setUser] = useState(null);
    let [myId, setMyId] = useState(null);

    useEffect(() => {
        setMyId(getMyId());
        if (userId != null) {
            getPublicUser(userId).then(setUser);
        }
    }, [userId]);

    if (userId == null)
        return "-";

    let text = userId == myId ? "You" : (userDisplayName(user) ?? "User " + userId);

    return (
        <Link href={`/user/${userId}`} title={text}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%" }}>
            <UserAvatarComponent user={user} userId={userId} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                {text}
            </span>
        </Link>
    );
}

export default UserLinkComponent;
