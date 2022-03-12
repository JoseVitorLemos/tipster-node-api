import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('members', table => {
		table.increments('id').primary().unique()
		table.string('email').notNullable().unique()
		table.string('userName').notNullable().unique()
		table.string('telegram').notNullable()
		table.string('whatsapp').notNullable()
		table.string('fullName').notNullable()
		table.string('password').notNullable()
		table.date('birth_date').notNullable()
		table.dateTime('createdAt').notNullable()
		table.dateTime('updatedAt').nullable()

	  table.integer('tipster_id')
			.notNullable()
			.references('id')
			.inTable('tipster')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('members')
}
