import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('tipster', table => {
		table.increments('id').primary().unique()
		table.string('email').notNullable().unique()
		table.string('userName').notNullable().unique()
		table.string('telegram').notNullable()
		table.string('whatsapp').notNullable()
		table.string('fullName').notNullable()
		table.string('password').notNullable()
		table.dateTime('createdAt').notNullable()
		table.dateTime('updatedAt').nullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('tipster')
}
