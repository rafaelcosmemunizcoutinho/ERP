namespace cadastro_livro
{
    partial class Form4
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label4 = new System.Windows.Forms.Label();
            this.textIdFor = new System.Windows.Forms.TextBox();
            this.comboStatusFor = new System.Windows.Forms.ComboBox();
            this.label7 = new System.Windows.Forms.Label();
            this.buttonDelFor = new System.Windows.Forms.Button();
            this.fornecedor_inativo = new System.Windows.Forms.CheckBox();
            this.listViewFor = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_name = new System.Windows.Forms.ColumnHeader();
            this.col_representante = new System.Windows.Forms.ColumnHeader();
            this.col_divida = new System.Windows.Forms.ColumnHeader();
            this.columnCel = new System.Windows.Forms.ColumnHeader();
            this.textNomeForBusca = new System.Windows.Forms.TextBox();
            this.btnBuscaFor = new System.Windows.Forms.Button();
            this.textDivFor = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textCelFor = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textRepreFor = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.buttonReset = new System.Windows.Forms.Button();
            this.textNomeFor = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.buttonRegFor = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(162, 22);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(17, 15);
            this.label4.TabIndex = 86;
            this.label4.Text = "Id";
            // 
            // textIdFor
            // 
            this.textIdFor.Enabled = false;
            this.textIdFor.Location = new System.Drawing.Point(185, 19);
            this.textIdFor.Name = "textIdFor";
            this.textIdFor.PlaceholderText = "Id Fornecedor";
            this.textIdFor.Size = new System.Drawing.Size(76, 23);
            this.textIdFor.TabIndex = 85;
            // 
            // comboStatusFor
            // 
            this.comboStatusFor.Enabled = false;
            this.comboStatusFor.FormattingEnabled = true;
            this.comboStatusFor.Items.AddRange(new object[] {
            "Ativo",
            "Inativo"});
            this.comboStatusFor.Location = new System.Drawing.Point(162, 194);
            this.comboStatusFor.Name = "comboStatusFor";
            this.comboStatusFor.Size = new System.Drawing.Size(99, 23);
            this.comboStatusFor.TabIndex = 84;
            this.comboStatusFor.Text = "Select";
            this.comboStatusFor.SelectedIndexChanged += new System.EventHandler(this.comboStatusFor_SelectedIndexChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(162, 176);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(39, 15);
            this.label7.TabIndex = 83;
            this.label7.Text = "Status";
            // 
            // buttonDelFor
            // 
            this.buttonDelFor.Location = new System.Drawing.Point(5, 271);
            this.buttonDelFor.Name = "buttonDelFor";
            this.buttonDelFor.Size = new System.Drawing.Size(256, 23);
            this.buttonDelFor.TabIndex = 82;
            this.buttonDelFor.Text = "Desativar";
            this.buttonDelFor.UseVisualStyleBackColor = true;
            this.buttonDelFor.Click += new System.EventHandler(this.buttonDelFor_Click);
            // 
            // fornecedor_inativo
            // 
            this.fornecedor_inativo.AutoSize = true;
            this.fornecedor_inativo.Location = new System.Drawing.Point(297, 21);
            this.fornecedor_inativo.Name = "fornecedor_inativo";
            this.fornecedor_inativo.Size = new System.Drawing.Size(89, 19);
            this.fornecedor_inativo.TabIndex = 81;
            this.fornecedor_inativo.Text = "Desativados";
            this.fornecedor_inativo.UseVisualStyleBackColor = true;
            this.fornecedor_inativo.CheckedChanged += new System.EventHandler(this.cliente_inativo_CheckedChanged);
            // 
            // listViewFor
            // 
            this.listViewFor.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_name,
            this.col_representante,
            this.col_divida,
            this.columnCel});
            this.listViewFor.FullRowSelect = true;
            this.listViewFor.Location = new System.Drawing.Point(297, 71);
            this.listViewFor.Name = "listViewFor";
            this.listViewFor.Size = new System.Drawing.Size(285, 252);
            this.listViewFor.TabIndex = 80;
            this.listViewFor.UseCompatibleStateImageBehavior = false;
            this.listViewFor.View = System.Windows.Forms.View.Details;
            this.listViewFor.SelectedIndexChanged += new System.EventHandler(this.listViewFor_click);
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 0;
            // 
            // col_name
            // 
            this.col_name.Text = "Nome";
            this.col_name.Width = 70;
            // 
            // col_representante
            // 
            this.col_representante.Text = "Representante";
            this.col_representante.Width = 80;
            // 
            // col_divida
            // 
            this.col_divida.Text = "Divida";
            this.col_divida.Width = 70;
            // 
            // columnCel
            // 
            this.columnCel.Text = "Celular";
            // 
            // textNomeForBusca
            // 
            this.textNomeForBusca.Location = new System.Drawing.Point(297, 43);
            this.textNomeForBusca.Name = "textNomeForBusca";
            this.textNomeForBusca.PlaceholderText = "Nome do Fornecedor";
            this.textNomeForBusca.Size = new System.Drawing.Size(191, 23);
            this.textNomeForBusca.TabIndex = 79;
            // 
            // btnBuscaFor
            // 
            this.btnBuscaFor.Location = new System.Drawing.Point(494, 43);
            this.btnBuscaFor.Name = "btnBuscaFor";
            this.btnBuscaFor.Size = new System.Drawing.Size(88, 23);
            this.btnBuscaFor.TabIndex = 78;
            this.btnBuscaFor.Text = "Buscar Fornecedor";
            this.btnBuscaFor.UseVisualStyleBackColor = true;
            this.btnBuscaFor.Click += new System.EventHandler(this.btnBuscaFor_Click);
            // 
            // textDivFor
            // 
            this.textDivFor.Location = new System.Drawing.Point(5, 194);
            this.textDivFor.Name = "textDivFor";
            this.textDivFor.PlaceholderText = "R$ 0.00";
            this.textDivFor.Size = new System.Drawing.Size(142, 23);
            this.textDivFor.TabIndex = 77;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(5, 176);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(130, 15);
            this.label3.TabIndex = 76;
            this.label3.Text = "Divida com Fornecedor";
            // 
            // textCelFor
            // 
            this.textCelFor.Location = new System.Drawing.Point(5, 146);
            this.textCelFor.Name = "textCelFor";
            this.textCelFor.PlaceholderText = "99 999999999";
            this.textCelFor.Size = new System.Drawing.Size(256, 23);
            this.textCelFor.TabIndex = 75;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(5, 128);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(65, 15);
            this.label2.TabIndex = 74;
            this.label2.Text = "Nº contato";
            // 
            // textRepreFor
            // 
            this.textRepreFor.Location = new System.Drawing.Point(5, 98);
            this.textRepreFor.Name = "textRepreFor";
            this.textRepreFor.PlaceholderText = "Representante do Fornecedor";
            this.textRepreFor.Size = new System.Drawing.Size(256, 23);
            this.textRepreFor.TabIndex = 73;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(5, 80);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(82, 15);
            this.label5.TabIndex = 72;
            this.label5.Text = "Representante";
            // 
            // buttonReset
            // 
            this.buttonReset.Enabled = false;
            this.buttonReset.Location = new System.Drawing.Point(5, 300);
            this.buttonReset.Name = "buttonReset";
            this.buttonReset.Size = new System.Drawing.Size(256, 23);
            this.buttonReset.TabIndex = 71;
            this.buttonReset.Text = "Limpar";
            this.buttonReset.UseVisualStyleBackColor = true;
            this.buttonReset.Click += new System.EventHandler(this.buttonReset_Click);
            // 
            // textNomeFor
            // 
            this.textNomeFor.Location = new System.Drawing.Point(5, 48);
            this.textNomeFor.Name = "textNomeFor";
            this.textNomeFor.PlaceholderText = "Nome Fornecedor";
            this.textNomeFor.Size = new System.Drawing.Size(256, 23);
            this.textNomeFor.TabIndex = 70;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(5, 30);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(114, 15);
            this.label1.TabIndex = 69;
            this.label1.Text = "Nome do Forncedor";
            // 
            // buttonRegFor
            // 
            this.buttonRegFor.Location = new System.Drawing.Point(5, 242);
            this.buttonRegFor.Name = "buttonRegFor";
            this.buttonRegFor.Size = new System.Drawing.Size(256, 23);
            this.buttonRegFor.TabIndex = 68;
            this.buttonRegFor.Text = "Salvar";
            this.buttonRegFor.UseVisualStyleBackColor = true;
            this.buttonRegFor.Click += new System.EventHandler(this.buttonRegFor_Click);
            // 
            // Form4
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(594, 349);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textIdFor);
            this.Controls.Add(this.comboStatusFor);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.buttonDelFor);
            this.Controls.Add(this.fornecedor_inativo);
            this.Controls.Add(this.listViewFor);
            this.Controls.Add(this.textNomeForBusca);
            this.Controls.Add(this.btnBuscaFor);
            this.Controls.Add(this.textDivFor);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textCelFor);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textRepreFor);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.buttonReset);
            this.Controls.Add(this.textNomeFor);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.buttonRegFor);
            this.Name = "Form4";
            this.Text = "Form4";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Label label4;
        private TextBox textIdFor;
        private ComboBox comboStatusFor;
        private Label label7;
        private Button buttonDelFor;
        private CheckBox fornecedor_inativo;
        private ListView listViewFor;
        private ColumnHeader id;
        private ColumnHeader col_name;
        private ColumnHeader col_representante;
        private ColumnHeader col_divida;
        private TextBox textNomeForBusca;
        private Button btnBuscaFor;
        private TextBox textDivFor;
        private Label label3;
        private TextBox textCelFor;
        private Label label2;
        private TextBox textRepreFor;
        private Label label5;
        private Button buttonReset;
        private TextBox textNomeFor;
        private Label label1;
        private Button buttonRegFor;
        private ColumnHeader columnCel;
    }
}