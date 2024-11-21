export interface User {
    id: string
    gender: string
    UserName: string
    culture: string
    isAnonymous: boolean
    uniqueArgument: string
    type: string
    fullName: string
    shortName: string
    jobTitle: string
    status: 'Offline' | 'Online' | 'Break'
    roles: string[]
}
