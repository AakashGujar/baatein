export function getProfilePic(fullName) {
    const splitNames = fullName.split(" ");
    let firstName = splitNames[0];
    let lastName =
        splitNames.length > 1 ? splitNames[splitNames.length - 1] : "";
    return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
}