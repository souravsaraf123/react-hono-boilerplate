import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userSchema, updateUserSchema } from '@api/shared/zod/user.schema';
import { DisplayLoader } from '@/components/displayLoader';
import { createFileRoute } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import type { z } from 'zod';

type User = {
	id: number;
	name: string;
	email: string;
};

type UserFormData = z.infer<typeof userSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Type guard to check if an object is a User
function isUser(obj: any): obj is User
{
	return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj && 'email' in obj;
}

export const Route = createFileRoute('/user')({
	component: RouteComponent,
});

function RouteComponent()
{
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingUserId, setEditingUserId] = useState<number | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const createForm = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	});

	const editForm = useForm<UpdateUserFormData>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	});

	// Fetch all users
	const fetchUsers = async () =>
	{
		try
		{
			setLoading(true);
			const res = await api.userMgmt.$get();
			const data = await res.json();
			setUsers(data);
		}
		catch (error)
		{
			console.error('Failed to fetch users:', error);
		}
		finally
		{
			setLoading(false);
		}
	};

	useEffect(() =>
	{
		fetchUsers();
	}, []);

	// Create user
	const onCreateSubmit = async (data: UserFormData) =>
	{
		try
		{
			const res = await api.userMgmt.create.$post({
				json: data,
			});
			const newUsers = await res.json();
			// The API returns an array with the new user
			if (Array.isArray(newUsers))
			{
				const validUsers = newUsers.filter(isUser);
				if (validUsers.length > 0)
				{
					setUsers([...users, ...validUsers]);
				}
			}
			createForm.reset();
			setIsCreating(false);
		}
		catch (error)
		{
			console.error('Failed to create user:', error);
		}
	};

	// Update user
	const onEditSubmit = async (data: UpdateUserFormData) =>
	{
		if (!editingUserId) return;

		try
		{
			const res = await api.userMgmt[':id'].$put({
				param: { id: editingUserId.toString() },
				json: data,
			});
			const updatedUser = await res.json();
			// Check if response is a user object
			if (isUser(updatedUser))
			{
				setUsers(users.map(u => (u.id === editingUserId ? updatedUser : u)));
				setEditingUserId(null);
				editForm.reset();
			}
		}
		catch (error)
		{
			console.error('Failed to update user:', error);
		}
	};

	// Delete user
	const handleDelete = async (id: number) =>
	{
		if (!confirm('Are you sure you want to delete this user?')) return;

		try
		{
			await api.userMgmt[':id'].$delete({
				param: { id: id.toString() },
			});
			setUsers(users.filter(u => u.id !== id));
		}
		catch (error)
		{
			console.error('Failed to delete user:', error);
		}
	};

	// Start editing
	const handleEdit = (user: User) =>
	{
		setEditingUserId(user.id);
		editForm.reset({
			name: user.name,
			email: user.email,
		});
	};

	// Cancel editing
	const handleCancelEdit = () =>
	{
		setEditingUserId(null);
		editForm.reset();
	};

	if (loading)
	{
		return <DisplayLoader message="Loading users..." />;
	}

	return (
		<div className="container mx-auto space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl sm:text-2xl">User Management</CardTitle>
					<CardDescription className="text-sm sm:text-base">Create, edit, and delete users</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 sm:space-y-6">
					{!isCreating ? (
						<Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
							Create New User
						</Button>
					) : (
						<Card className="mb-4 sm:mb-6">
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">Create User</CardTitle>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="create-name">Name</Label>
										<Input id="create-name" {...createForm.register('name')} placeholder="Enter name" />
										{createForm.formState.errors.name && (
											<p className="text-destructive text-sm">{createForm.formState.errors.name.message}</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="create-email">Email</Label>
										<Input id="create-email" type="email" {...createForm.register('email')} placeholder="Enter email" />
										{createForm.formState.errors.email && (
											<p className="text-destructive text-sm">{createForm.formState.errors.email.message}</p>
										)}
									</div>
									<div className="flex flex-col gap-2 sm:flex-row">
										<Button type="submit" className="w-full sm:w-auto">
											Create
										</Button>
										<Button
											type="button"
											variant="outline"
											className="w-full sm:w-auto"
											onClick={() =>
												{
												setIsCreating(false);
												createForm.reset();
											}}>
											Cancel
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					<div className="mt-4 space-y-4 sm:mt-6">
						<h2 className="text-base font-semibold sm:text-lg">Users</h2>
						{users.length === 0 ? (
							<p className="text-muted-foreground text-sm sm:text-base">No users found. Create one to get started.</p>
						) : (
							<div className="space-y-3 sm:space-y-4">
								{users.map(user => (
									<Card key={user.id}>
										<CardContent className="p-4 sm:p-6">
											{editingUserId === user.id ? (
												<form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
													<div className="space-y-2">
														<Label htmlFor={`edit-name-${user.id}`}>Name</Label>
														<Input id={`edit-name-${user.id}`} {...editForm.register('name')} placeholder="Enter name" />
														{editForm.formState.errors.name && (
															<p className="text-destructive text-sm">{editForm.formState.errors.name.message}</p>
														)}
													</div>
													<div className="space-y-2">
														<Label htmlFor={`edit-email-${user.id}`}>Email</Label>
														<Input
															id={`edit-email-${user.id}`}
															type="email"
															{...editForm.register('email')}
															placeholder="Enter email"
														/>
														{editForm.formState.errors.email && (
															<p className="text-destructive text-sm">{editForm.formState.errors.email.message}</p>
														)}
													</div>
													<div className="flex flex-col gap-2 sm:flex-row">
														<Button type="submit" className="w-full sm:w-auto">
															Save
														</Button>
														<Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleCancelEdit}>
															Cancel
														</Button>
													</div>
												</form>
											) : (
												<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
													<div className="flex-1">
														<div>
															<p className="text-sm font-medium sm:text-base">{user.name}</p>
															<p className="text-muted-foreground text-xs break-words sm:text-sm">{user.email}</p>
														</div>
													</div>
													<div className="flex gap-2 sm:flex-shrink-0">
														<Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="flex-1 sm:flex-initial">
															<Pencil className="h-4 w-4 sm:mr-2" />
															<span className="hidden sm:inline">Edit</span>
														</Button>
														<Button
															variant="destructive"
															size="sm"
															onClick={() => handleDelete(user.id)}
															className="flex-1 sm:flex-initial">
															<Trash2 className="h-4 w-4 sm:mr-2" />
															<span className="hidden sm:inline">Delete</span>
														</Button>
													</div>
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
