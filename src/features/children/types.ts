export interface ChildDTO {
	id: number;
	firstName: string;
	lastName: string;
	patronymic: string;
	birthdayDate: string;
	group: {
		id: number;
		name: string;
		childCount: number;
	};
}

export interface CreateChildDTO {
	firstName: string;
	lastName: string;
	patronymic: string;
	birthdayDate: string;
	groupId: number;
}
