export type User = {
    id: number,
    pseudo: string,
    image: String | null,
    isFollowing?: boolean,
    isFollower?: boolean,
}
